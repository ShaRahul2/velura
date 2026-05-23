'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'

const DURATION = 3200

export function ToastContainer() {
  const { toasts, removeToast } = useUiStore()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
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
    const timer = setTimeout(() => onDismiss(id), DURATION)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 rounded-btn px-4 py-3 shadow-toast"
      style={{
        background: '#0F0D0B',
        color: '#EDE9E4',
        animation: 'slideUp 0.22s ease',
        minWidth: '240px',
        maxWidth: '340px',
      }}
    >
      <span className="font-sans text-[0.8rem] font-light flex-1">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
