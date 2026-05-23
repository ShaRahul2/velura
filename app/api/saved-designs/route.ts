import { NextRequest, NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ data: [] })
}

export async function POST(req: NextRequest) {
  try {
    await req.json()
    const id = `design-${Date.now()}`
    return NextResponse.json({ data: { id } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
