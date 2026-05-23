import { NextRequest, NextResponse } from 'next/server'
import { calculateFit } from '@/lib/fitCalculator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    if (
      typeof body !== 'object' || body === null ||
      !('bust' in body) || !('underbust' in body) || !('unit' in body)
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const { bust, underbust, unit } = body as { bust: unknown; underbust: unknown; unit: unknown }
    if (typeof bust !== 'number' || typeof underbust !== 'number') {
      return NextResponse.json({ error: 'bust and underbust must be numbers' }, { status: 400 })
    }
    if (unit !== 'cm' && unit !== 'in') {
      return NextResponse.json({ error: 'unit must be cm or in' }, { status: 400 })
    }
    const result = calculateFit({ bust, underbust, unit })
    return NextResponse.json({ data: result })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
