import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeBanner } from '@/components/home/MarqueeBanner'
import { Lookbook } from '@/components/home/Lookbook'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { AtelierBanner } from '@/components/home/AtelierBanner'
import { ValuesSection } from '@/components/home/ValuesSection'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'
import { JsonLd } from '@/components/seo/JsonLd'
import { siteUrl } from '@/lib/site'

export default function HomePage() {
  const base = siteUrl()
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'VELURA',
          url: base,
          description: 'Premium Indian lingerie. Crafted for the woman who knows.',
          brand: { '@type': 'Brand', name: 'VELURA' },
        }}
      />
      <HeroSection />
      <MarqueeBanner />
      <Lookbook />
      <CategoryGrid />
      <FeaturedProducts />
      <AtelierBanner />
      <ValuesSection />
      <Testimonials />
      <Newsletter />
    </>
  )
}
