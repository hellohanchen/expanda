import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '../../../lib/prisma'
import type { ActionResponse } from '../../../types/actions'

export async function GET(): Promise<NextResponse<ActionResponse>> {
  try {
    const isDatabaseConnected = await checkDatabaseConnection()

    if (!isDatabaseConnected) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        data: null
      }, { status: 503 })
    }

    return NextResponse.json({
      success: true,
      error: null,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString()
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      data: null
    }, { status: 500 })
  }
} 