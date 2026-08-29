'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'

const DURATION = 3200

export function ToastContainer() {
  const { toasts, removeToast } = useUiStore()

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} message={t.message} onDismiss={removeToast} />
      ))}
    </div>
  )
}

function Toast({
  id,
  message,
  onDismiss,
}: {
  id: string
  message: string
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    let remaining = DURATION
    let started = Date.now()
    let timer = window.setTimeout(() => onDismiss(id), remaining)

    function onVisibility() {
      if (document.hidden) {
        window.clearTimeout(timer)
        remaining -= Date.now() - started
      } else {
        started = Date.now()
        timer = window.setTimeout(() => onDismiss(id), Math.max(0, remaining))
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [id, onDismiss])

  return (
    <div
      className="toast-item pointer-events-auto flex items-center gap-3 rounded-btn px-4 py-3 shadow-toast"
      style={{
        background: '#0F0D0B',
        color: '#EDE9E4',
        minWidth: '240px',
        maxWidth: '340px',
      }}
      role="status"
    >
      <span className="font-sans text-[0.8rem] lg:text-[0.86rem] font-light flex-1">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity duration-150 ease-out"
        aria-label="Dismiss"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
