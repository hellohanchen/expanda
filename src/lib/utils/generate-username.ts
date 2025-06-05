import { prisma } from "@/lib/db"

function sanitizeForHandle(text: string): string {
  // Remove special characters and spaces, convert to lowercase
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

async function generateUniqueHandle(baseName: string): Promise<string> {
  // Clean the input name
  const cleanName = baseName?.trim() || 'user'
  const baseHandle = sanitizeForHandle(cleanName)
  
  // If base handle is too short, pad it
  const paddedHandle = baseHandle.length < 3 ? baseHandle + "user" : baseHandle
  
  // Truncate to leave room for numbers (max 18 chars)
  const truncatedHandle = paddedHandle.slice(0, 14)
  
  // Ensure minimum length of 6 characters
  const finalHandle = truncatedHandle.length < 6 ? (truncatedHandle + "user").slice(0, 14) : truncatedHandle
  
  // Try without number first
  const handleExists = await prisma.user.findUnique({
    where: { handle: finalHandle }
  })

  if (!handleExists) {
    return finalHandle
  }

  // Try with numbers until we find a unique one
  let counter = 1
  while (counter < 10000) {
    const counterStr = counter.toString()
    const maxBaseLength = 18 - counterStr.length
    const newHandle = finalHandle.slice(0, maxBaseLength) + counterStr
    
    // Ensure still meets minimum length requirement
    if (newHandle.length < 6) {
      counter++
      continue
    }
    
    const exists = await prisma.user.findUnique({
      where: { handle: newHandle }
    })

    if (!exists) {
      return newHandle
    }

    counter++
  }

  // If we somehow get here, generate a random handle
  const randomSuffix = Math.random().toString(36).slice(2, 8)
  return `user${randomSuffix}`
}

async function generateUniqueUsername(name: string): Promise<string> {
  // Clean the input name
  const cleanName = name?.trim() || 'user'
  const baseUsername = cleanName.replace(/[^\w\s]/g, '').replace(/\s+/g, '') || 'user'
  
  // Ensure minimum length
  const finalBaseUsername = baseUsername.length < 3 ? `${baseUsername}user` : baseUsername
  
  // Try the base username first (truncate if too long)
  const truncatedBase = finalBaseUsername.slice(0, 28) // Leave room for numbers
  
  const usernameExists = await prisma.user.findUnique({
    where: { username: truncatedBase }
  })

  if (!usernameExists) {
    return truncatedBase
  }

  // Try with numbers until we find a unique one
  let counter = 1
  while (counter < 10000) {
    const counterStr = counter.toString()
    const maxBaseLength = 32 - counterStr.length
    const truncatedUsername = truncatedBase.slice(0, maxBaseLength) + counterStr
    
    const exists = await prisma.user.findUnique({
      where: { username: truncatedUsername }
    })

    if (!exists) {
      return truncatedUsername
    }

    counter++
  }

  // If we somehow get here, generate a random username
  return `user${Math.random().toString(36).slice(2, 12)}`
}

export async function generateUsernameAndHandle(name: string): Promise<{ username: string; handle: string }> {
  const username = await generateUniqueUsername(name)
  const handle = await generateUniqueHandle(name)
  
  return { username, handle }
} 