import { pageWrap } from '@/lib/utils'

export function InfoPage({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children: React.ReactNode
}) {
  return (
    <article className={`${pageWrap} max-w-[42rem] py-14 md:py-20 lg:py-24`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        {kicker}
      </p>
      <h1
        className="mb-10 font-serif font-light text-deep md:mb-14"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}
      >
        {title}
      </h1>
      <div className="space-y-8 font-sans text-[0.92rem] font-light leading-relaxed text-mauve">
        {children}
      </div>
    </article>
  )
}

export function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-[1.35rem] font-light text-deep">{title}</h2>
      {children}
    </section>
  )
}
