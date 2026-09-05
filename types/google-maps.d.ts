export {}

declare global {
  namespace google.maps {
    interface MapsEventListener {
      remove: () => void
    }
    const event: {
      removeListener: (listener: MapsEventListener) => void
    }
    namespace places {
      class Autocomplete {
        constructor(
          input: HTMLInputElement,
          opts?: {
            componentRestrictions?: { country: string | string[] }
            fields?: string[]
            types?: string[]
          },
        )
        addListener(eventName: string, handler: () => void): google.maps.MapsEventListener
        getPlace(): {
          formatted_address?: string
          place_id?: string
          geometry?: { location?: { lat: () => number; lng: () => number } }
          address_components?: Array<{
            long_name: string
            short_name: string
            types: string[]
          }>
        }
      }
    }
  }

  interface Window {
    google?: typeof google
  }
}
