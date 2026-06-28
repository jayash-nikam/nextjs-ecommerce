import { NextRequest, NextResponse } from 'next/server'
import { generateReply } from '@/lib/chat/engine'
import type { ChatContext } from '@/types/chat'

export async function POST(request: NextRequest) {
  let message = ''
  let context: ChatContext | undefined

  try {
    const body = await request.json()
    message = typeof body?.message === 'string' ? body.message : ''
    if (body?.context && typeof body.context === 'object') {
      context = body.context as ChatContext
    }
  } catch {
    return NextResponse.json(
      { text: 'Sorry, I could not read that message. Please try again.' },
      { status: 400 },
    )
  }

  if (message.length > 500) {
    message = message.slice(0, 500)
  }

  try {
    const reply = await generateReply(message, context)
    return NextResponse.json(reply)
  } catch {
    return NextResponse.json(
      {
        text: "Something went wrong on my end. Please try again in a moment, or browse the store directly.",
        suggestions: ['Recommend a laptop', 'Shipping & returns'],
      },
      { status: 500 },
    )
  }
}
