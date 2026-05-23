'use client'

const STEPS = ['Size', 'Type', 'Style', 'Fabric', 'Review']

interface StepBarProps {
  current: number
}

export function StepBar({ current }: StepBarProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const step   = i + 1
        const done   = step < current
        const active = step === current

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: done ? '#0F0D0B' : active ? '#0F0D0B' : 'transparent',
                  border: done || active ? 'none' : '1.5px solid #D8D4CE',
                }}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                    <path d="M2.5 7l3 3 6-6" stroke="#EDE9E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span
                    className="font-sans text-[0.62rem]"
                    style={{ color: active ? '#EDE9E4' : '#9A8878' }}
                  >
                    {step}
                  </span>
                )}
              </div>
              <span
                className="font-sans text-[0.6rem] tracking-label uppercase hidden sm:block"
                style={{ color: active ? '#0F0D0B' : '#9A8878' }}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-4 transition-colors duration-200"
                style={{ background: done ? '#0F0D0B' : '#D8D4CE' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
