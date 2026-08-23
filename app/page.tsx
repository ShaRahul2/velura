import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeBanner } from '@/components/home/MarqueeBanner'
import { Lookbook } from '@/components/home/Lookbook'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { AtelierBanner } from '@/components/home/AtelierBanner'
import { ValuesSection } from '@/components/home/ValuesSection'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
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
