export {}

declare global {
  namespace google.maps {
    function importLibrary(name: 'places'): Promise<PlacesLibrary>

    interface PlacesLibrary {
      AutocompleteSuggestion: typeof places.AutocompleteSuggestion
      AutocompleteSessionToken: typeof places.AutocompleteSessionToken
      Place: typeof places.Place
    }

    namespace places {
      class AutocompleteSessionToken {}

      class AutocompleteSuggestion {
        placePrediction?: PlacePrediction | null
        static fetchAutocompleteSuggestions(request: {
          input: string
          sessionToken?: AutocompleteSessionToken
          includedRegionCodes?: string[]
          language?: string
          region?: string
        }): Promise<{ suggestions: AutocompleteSuggestion[] }>
      }

      class PlacePrediction {
        text: { toString: () => string; text?: string }
        toPlace: () => Place
      }

      class Place {
        id?: string | null
        formattedAddress?: string | null
        addressComponents?: Array<{
          longText?: string | null
          shortText?: string | null
          types: string[]
        }>
        location?: { lat: () => number; lng: () => number } | null
        fetchFields: (opts: { fields: string[] }) => Promise<{ place: Place }>
      }
    }
  }

  interface Window {
    google?: typeof google
  }
}
