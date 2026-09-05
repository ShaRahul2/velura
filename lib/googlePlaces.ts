import { matchIndianState } from '@/lib/indianAddress'
import type { Address } from '@/types'

export interface PlaceAddressComponent {
  longText?: string | null
  shortText?: string | null
  types: string[]
}

export interface PlaceDetailsLike {
  id?: string | null
  formattedAddress?: string | null
  addressComponents?: PlaceAddressComponent[]
  location?: { lat: number | (() => number); lng: number | (() => number) } | null
}

export type PlaceSuggestion = {
  id: string
  text: string
  prediction: google.maps.places.PlacePrediction
}

function pick(place: PlaceDetailsLike, type: string): string {
  const c = place.addressComponents?.find((x) => x.types.includes(type))
  return c?.longText?.trim() ?? ''
}

function coord(value: number | (() => number) | undefined): number | undefined {
  if (typeof value === 'function') return value()
  return value
}

export function placeToAddress(place: PlaceDetailsLike, current: Address): Address {
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

  return {
    ...current,
    addressLine: line || place.formattedAddress?.split(',').slice(0, 2).join(',').trim() || current.addressLine,
    city: locality || district || current.city,
    state: state || current.state,
    pinCode: /^\d{6}$/.test(pin) ? pin : current.pinCode,
    placeId: place.id ?? current.placeId,
    lat: coord(place.location?.lat) ?? current.lat,
    lng: coord(place.location?.lng) ?? current.lng,
  }
}

export function waitForGoogleMaps(ms = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }
    if (typeof window.google?.maps?.importLibrary === 'function') {
      resolve(true)
      return
    }
    const start = Date.now()
    const id = window.setInterval(() => {
      if (typeof window.google?.maps?.importLibrary === 'function') {
        window.clearInterval(id)
        resolve(true)
      } else if (Date.now() - start > ms) {
        window.clearInterval(id)
        resolve(false)
      }
    }, 80)
  })
}

export async function fetchPlaceSuggestions(
  input: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<PlaceSuggestion[]> {
  const { AutocompleteSuggestion } = await google.maps.importLibrary('places')
  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input,
    sessionToken,
    includedRegionCodes: ['IN'],
    language: 'en',
    region: 'IN',
  })

  return suggestions.flatMap((suggestion, i) => {
    const prediction = suggestion.placePrediction
    if (!prediction) return []
    const text = prediction.text.toString()
    return [{ id: `${text}-${i}`, text, prediction }]
  })
}

export async function placeFromPrediction(
  prediction: google.maps.places.PlacePrediction,
): Promise<PlaceDetailsLike> {
  const place = prediction.toPlace()
  await place.fetchFields({
    fields: ['id', 'formattedAddress', 'addressComponents', 'location'],
  })
  return place
}

export async function newPlacesSession(): Promise<google.maps.places.AutocompleteSessionToken> {
  const { AutocompleteSessionToken } = await google.maps.importLibrary('places')
  return new AutocompleteSessionToken()
}
