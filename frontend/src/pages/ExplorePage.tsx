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

/**
 * Full explore module: features, UK & Qatar, how it works, insights, facilities.
 * Same content that was on the home page – wrapped as a separate page.
 */
export function ExplorePage() {
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
