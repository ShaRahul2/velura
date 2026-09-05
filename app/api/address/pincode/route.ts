import { NextRequest, NextResponse } from 'next/server'
import { matchIndianState } from '@/lib/indianAddress'

export async function GET(req: NextRequest) {
  const pin = req.nextUrl.searchParams.get('pin')?.trim() ?? ''
  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: 'Enter a 6-digit PIN code' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Could not look up PIN' }, { status: 502 })
    }
    const json = (await res.json()) as Array<{
      Status?: string
      PostOffice?: Array<{ District?: string; State?: string; Name?: string }>
    }>
    const office = json[0]?.PostOffice?.[0]
    if (json[0]?.Status !== 'Success' || !office) {
      return NextResponse.json({ error: 'Unknown PIN code' }, { status: 404 })
    }
    return NextResponse.json({
      data: {
        city: office.District ?? '',
        state: matchIndianState(office.State ?? ''),
        locality: office.Name ?? '',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Could not look up PIN' }, { status: 502 })
  }
}
