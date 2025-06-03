import { prisma } from "@/lib/db"

function sanitizeForHandle(text: string): string {
  // Remove special characters and spaces, convert to lowercase
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

async function generateUniqueHandle(baseName: string): Promise<string> {
  const baseHandle = sanitizeForHandle(baseName)
  
  // If base handle is too short, pad it
  const paddedHandle = baseHandle.length < 6 ? baseHandle + "user" : baseHandle
  
  // Truncate to 18 characters max (to leave room for numbers if needed)
  const truncatedHandle = paddedHandle.slice(0, 18)
  
  // Try without number first
  const handleExists = await prisma.user.findUnique({
    where: { handle: truncatedHandle }
  })

  if (!handleExists) {
    return truncatedHandle
  }

  // Try with numbers until we find a unique one
  let counter = 1
  while (counter < 1000) {
    const numberSuffix = counter.toString()
    const newHandle = truncatedHandle.slice(0, 18 - numberSuffix.length) + numberSuffix
    
    const exists = await prisma.user.findUnique({
      where: { handle: newHandle }
    })

    if (!exists) {
      return newHandle
    }

    counter++
  }

  // If we somehow get here, generate a random handle
  return `user${Math.random().toString(36).slice(2, 8)}`
}

async function generateUniqueUsername(name: string): Promise<string> {
  const baseUsername = name.replace(/[^\w\s]/g, '')
  
  // Try the base username first
  const usernameExists = await prisma.user.findUnique({
    where: { username: baseUsername }
  })

  if (!usernameExists) {
    return baseUsername
  }

  // Try with numbers until we find a unique one
  let counter = 1
  while (counter < 1000) {
    const newUsername = `${baseUsername}${counter}`
    
    if (newUsername.length > 32) {
      // If too long, truncate the base and add the number
      const truncatedBase = baseUsername.slice(0, 32 - counter.toString().length)
      const truncatedUsername = `${truncatedBase}${counter}`
      
      const exists = await prisma.user.findUnique({
        where: { username: truncatedUsername }
      })

      if (!exists) {
        return truncatedUsername
      }
    } else {
      const exists = await prisma.user.findUnique({
        where: { username: newUsername }
      })

      if (!exists) {
        return newUsername
      }
    }

    counter++
  }

  // If we somehow get here, generate a random username
  return `user${Math.random().toString(36).slice(2, 8)}`
}

export async function generateUsernameAndHandle(name: string): Promise<{ username: string; handle: string }> {
  const username = await generateUniqueUsername(name)
  const handle = await generateUniqueHandle(name)
  
  return { username, handle }
} 