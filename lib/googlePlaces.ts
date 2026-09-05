import { matchIndianState } from '@/lib/indianAddress'
import type { Address } from '@/types'

export interface GoogleAddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export interface GooglePlaceLike {
  formatted_address?: string
  place_id?: string
  geometry?: { location?: { lat: () => number; lng: () => number } }
  address_components?: GoogleAddressComponent[]
}

function pick(place: GooglePlaceLike, type: string, short = false): string {
  const c = place.address_components?.find((x) => x.types.includes(type))
  if (!c) return ''
  return short ? c.short_name : c.long_name
}

export function placeToAddress(place: GooglePlaceLike, current: Address): Address {
  const premise = pick(place, 'premise')
  const subpremise = pick(place, 'subpremise')
  const streetNumber = pick(place, 'street_number')
  const route = pick(place, 'route')
  const neighborhood = pick(place, 'neighborhood')
  const sublocality =
    pick(place, 'sublocality_level_1') ||
    pick(place, 'sublocality') ||
    pick(place, 'sublocality_level_2')
  const locality = pick(place, 'locality')
  const district = pick(place, 'administrative_area_level_2')
  const pin = pick(place, 'postal_code')
  const state = matchIndianState(pick(place, 'administrative_area_level_1'))

  const line = [premise || subpremise, streetNumber, route, neighborhood || sublocality]
    .filter(Boolean)
    .join(', ')

  const loc = place.geometry?.location

  return {
    ...current,
    addressLine: line || place.formatted_address?.split(',').slice(0, 2).join(',').trim() || current.addressLine,
    city: locality || district || current.city,
    state: state || current.state,
    pinCode: /^\d{6}$/.test(pin) ? pin : current.pinCode,
    placeId: place.place_id ?? current.placeId,
    lat: loc ? loc.lat() : current.lat,
    lng: loc ? loc.lng() : current.lng,
  }
}
