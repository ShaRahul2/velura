import { HeroSection } from '@/components/home/HeroSection'
import { TrustStrip } from '@/components/home/TrustStrip'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { AtelierBanner } from '@/components/home/AtelierBanner'
import { Lookbook } from '@/components/home/Lookbook'
import { EditorialQuote } from '@/components/home/EditorialQuote'
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
      <TrustStrip />
      <FeaturedProducts />
      <CategoryGrid />
      <AtelierBanner />
      <Lookbook />
      <EditorialQuote />
    </>
  )
}
