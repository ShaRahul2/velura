import { create } from 'zustand'

export interface ToastMessage {
  id: string
  message: string
}

interface UiStore {
  cartOpen: boolean
  mobileMenuOpen: boolean
  toasts: ToastMessage[]
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  addToast: (message: string) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useUiStore = create<UiStore>()((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  toasts: [],
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
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
