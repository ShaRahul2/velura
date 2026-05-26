export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-lm"
          style={{ borderTopColor: 'var(--rose)', animation: 'spin 0.9s linear infinite' }}
        />
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">Loading</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
