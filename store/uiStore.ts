import { create } from 'zustand'

export interface ToastMessage {
  id: string
  message: string
}

interface UiStore {
  cartOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  stylistOpen: boolean
  toasts: ToastMessage[]
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
  openStylist: () => void
  closeStylist: () => void
  addToast: (message: string) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useUiStore = create<UiStore>()((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  stylistOpen: false,
  toasts: [],
  openCart: () => set({ cartOpen: true, searchOpen: false, stylistOpen: false, mobileMenuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  openMobileMenu: () => set({ mobileMenuOpen: true, searchOpen: false, stylistOpen: false }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  openSearch: () => set({ searchOpen: true, cartOpen: false, stylistOpen: false, mobileMenuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  openStylist: () => set({ stylistOpen: true, cartOpen: false, searchOpen: false, mobileMenuOpen: false }),
  closeStylist: () => set({ stylistOpen: false }),
  addToast: (message) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: String(Date.now()), message },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))

export const useUi = useUiStore
