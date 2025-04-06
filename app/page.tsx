import { HeroSection } from "@/components/hero-section"
import { ProductTour } from "@/components/product-tour"
import { DashboardPreview } from "@/components/dashboard-preview"
import { TechCapabilities } from "@/components/tech-capabilities"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { BeeEasterEgg } from "@/components/bee-easter-egg"
import { UrlSecurity } from "@/components/url-security"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <BeeEasterEgg />
      <Header />
      <HeroSection />
      <ProductTour />
      <Dashboard />
      <UrlSecurity />
      <TechCapabilities />
      <Footer />
    </main>
  )
}

