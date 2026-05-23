import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeBanner } from '@/components/home/MarqueeBanner'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { ValuesSection } from '@/components/home/ValuesSection'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <ValuesSection />
      <Testimonials />
      <Newsletter />
    </>
  )
}
