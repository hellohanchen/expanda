import { NextRequest, NextResponse } from "next/server"
import { toggleFollow } from "@/lib/actions/user"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    const result = await toggleFollow(userId)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in follow API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 