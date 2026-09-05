import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeBanner } from '@/components/home/MarqueeBanner'
import { FeaturedProducts, FeaturedProductsSkeleton } from '@/components/home/FeaturedProducts'
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
      <MarqueeBanner />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <CategoryGrid />
      <AtelierBanner />
      <Lookbook />
      <EditorialQuote />
    </>
  )
}
