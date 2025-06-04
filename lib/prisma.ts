import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

function getPrismaClient() {
  const client = new PrismaClient({
    log: getLogLevel(),
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      },
    },
  })

  // Soft shutdown handler
  process.on('SIGINT', async () => {
    try {
      await client.$disconnect()
      console.log('Disconnected from database')
      process.exit(0)
    } catch (err) {
      console.error('Error disconnecting from database:', err)
      process.exit(1)
    }
  })

  return client
}

function getLogLevel() {
  if (process.env.NODE_ENV === 'development') {
    return [
      {
        emit: 'stdout',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ]
  }
  
  // Production logging
  return [
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ]
}

// Add a health check function
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
} 