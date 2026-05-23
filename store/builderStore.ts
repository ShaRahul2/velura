import { create } from 'zustand'
import type { BuilderState } from '@/types'
import {
  CB_BRA_TYPES,
  CB_CLOSURE_OPTIONS,
  CB_FABRIC_OPTIONS,
  CB_PADDING_OPTIONS,
  CB_SUPPORT_OPTIONS,
  CB_STRAP_STYLES,
  CB_UNDERWIRE_OPTIONS,
} from '@/data/builderOptions'

const BASE_PRICE = 999

const priceMap = new Map<string, number>([
  ...CB_BRA_TYPES.map((option): [string, number] => [option.id, option.price]),
  ...CB_STRAP_STYLES.map((option): [string, number] => [option.id, option.price]),
  ...CB_PADDING_OPTIONS.map((option): [string, number] => [option.id, option.price]),
  ...CB_UNDERWIRE_OPTIONS.map((option): [string, number] => [option.id, option.price]),
  ...CB_CLOSURE_OPTIONS.map((option): [string, number] => [option.id, option.price]),
  ...CB_SUPPORT_OPTIONS.map((option): [string, number] => [option.id, option.price]),
  ...CB_FABRIC_OPTIONS.map((option): [string, number] => [option.id, option.price]),
])

function optionPrice(optionId: string | null) {
  return optionId ? priceMap.get(optionId) ?? 0 : 0
}

function calculatePrice(state: BuilderState) {
  return (
    BASE_PRICE +
    optionPrice(state.braType) +
    optionPrice(state.strapStyle) +
    optionPrice(state.padding) +
    optionPrice(state.underwire) +
    optionPrice(state.closure) +
    optionPrice(state.support) +
    optionPrice(state.fabric)
  )
}

interface BuilderStore extends BuilderState {
  price: number
  setSizeMode: (mode: 'standard' | 'fit') => void
  setBand: (band: string | null) => void
  setCup: (cup: string | null) => void
  setBraType: (braType: string | null) => void
  setStrapStyle: (strapStyle: string | null) => void
  setPadding: (padding: string | null) => void
  setUnderwire: (underwire: string | null) => void
  setClosure: (closure: string | null) => void
  setSupport: (support: string | null) => void
  setFabric: (fabric: string | null) => void
  setColor: (color: string | null) => void
  reset: () => void
}

const initialState: BuilderState = {
  sizeMode: 'standard',
  band: null,
  cup: null,
  braType: null,
  strapStyle: null,
  padding: null,
  underwire: null,
  closure: null,
  support: null,
  fabric: null,
  color: null,
  fitUnit: 'cm',
}

export const useBuilderStore = create<BuilderStore>()((set, get) => ({
  ...initialState,
  price: BASE_PRICE,
  setSizeMode: (sizeMode) => set(() => ({ sizeMode })),
  setBand: (band) => set((state) => ({ band })),
  setCup: (cup) => set((state) => ({ cup })),
  setBraType: (braType) =>
    set((state) => ({ braType, price: calculatePrice({ ...state, braType }) })),
  setStrapStyle: (strapStyle) =>
    set((state) => ({ strapStyle, price: calculatePrice({ ...state, strapStyle }) })),
  setPadding: (padding) =>
    set((state) => ({ padding, price: calculatePrice({ ...state, padding }) })),
  setUnderwire: (underwire) =>
    set((state) => ({ underwire, price: calculatePrice({ ...state, underwire }) })),
  setClosure: (closure) =>
    set((state) => ({ closure, price: calculatePrice({ ...state, closure }) })),
  setSupport: (support) =>
    set((state) => ({ support, price: calculatePrice({ ...state, support }) })),
  setFabric: (fabric) =>
    set((state) => ({ fabric, price: calculatePrice({ ...state, fabric }) })),
  setColor: (color) => set(() => ({ color })),
  reset: () => set({ ...initialState, price: BASE_PRICE }),
}))

export const useBuilder = useBuilderStore
