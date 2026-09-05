export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
] as const

const ALIASES: Record<string, string> = {
  'nct of delhi': 'Delhi',
  'delhi': 'Delhi',
  'orissa': 'Odisha',
  'odisha': 'Odisha',
  'jammu and kashmir': 'Jammu & Kashmir',
  'jammu & kashmir': 'Jammu & Kashmir',
  'pondicherry': 'Tamil Nadu',
  'puducherry': 'Tamil Nadu',
  'uttaranchal': 'Uttarakhand',
}

export function matchIndianState(raw: string | undefined | null): string {
  if (!raw) return ''
  const key = raw.trim().toLowerCase()
  if (ALIASES[key]) return ALIASES[key]
  const exact = INDIAN_STATES.find((s) => s.toLowerCase() === key)
  if (exact) return exact
  const partial = INDIAN_STATES.find((s) => key.includes(s.toLowerCase()) || s.toLowerCase().includes(key))
  return partial ?? ''
}

export function googleMapsBrowserKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
}

export function googlePlacesAvailable(): boolean {
  return Boolean(googleMapsBrowserKey())
}
