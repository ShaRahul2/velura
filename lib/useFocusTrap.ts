'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(
  active: boolean,
  rootRef: RefObject<HTMLElement | null>,
  onClose?: () => void
) {
  useEffect(() => {
    if (!active) return

    const previous = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    const root = rootRef.current
    const items = () =>
      root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

    const first = items()[0]
    if (first) first.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      if (list.length === 0) return
      const current = document.activeElement as HTMLElement | null
      const index = current ? list.indexOf(current) : -1
      if (e.shiftKey) {
        if (index <= 0) {
          e.preventDefault()
          list[list.length - 1]?.focus()
        }
      } else if (index === list.length - 1) {
        e.preventDefault()
        list[0]?.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [active, rootRef, onClose])
}
