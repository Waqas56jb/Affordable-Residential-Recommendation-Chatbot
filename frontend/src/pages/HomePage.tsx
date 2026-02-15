import {
  HeroSection,
  StatsKPIs,
  FeaturesSection,
  UKQatarSection,
  HowItWorks,
  ChartsSection,
  FacilitiesSection,
  CTASection,
} from '@/components/landing'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsKPIs />
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="uk-qatar">
        <UKQatarSection />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="insights">
        <ChartsSection />
      </section>
      <section id="facilities">
        <FacilitiesSection />
      </section>
      <section id="cta">
        <CTASection />
      </section>
    </>
  )
}
