import { motion } from 'framer-motion'
import {
  FaUniversity,
  FaShieldAlt,
  FaUtensils,
  FaBus,
  FaPoundSign,
  FaUsers,
} from 'react-icons/fa'
import { LANDING_IMAGES, HERO_SLIDES } from '@/constants/images'

const FALLBACK_IMAGE = HERO_SLIDES[0]

const features = [
  {
    icon: FaUniversity,
    title: 'Nearest to universities',
    description: 'Reduce commute time and focus on studies. We rank areas by distance to your university and transport links.',
    image: LANDING_IMAGES.university,
  },
  {
    icon: FaShieldAlt,
    title: 'Crime-free & safe areas',
    description: 'Live in neighbourhoods with low crime rates, good lighting, and proximity to police stations for peace of mind.',
    image: LANDING_IMAGES.safeHousing,
  },
  {
    icon: FaUtensils,
    title: 'Halal food & quality dining',
    description: 'Find areas with halal restaurants, fresh food markets, and grocery stores that suit your diet and budget.',
    image: LANDING_IMAGES.halalFood,
  },
  {
    icon: FaBus,
    title: 'Cheap & reliable transport',
    description: 'Less congestion, good roads, and affordable buses and metros. Fewer accidents and shorter travel times.',
    image: LANDING_IMAGES.transport,
  },
  {
    icon: FaPoundSign,
    title: 'Low-cost housing',
    description: 'Apartments, shared housing, and student residences that fit your budget without compromising on quality.',
    image: LANDING_IMAGES.safeHousing,
  },
  {
    icon: FaUsers,
    title: 'Less crowded, peaceful life',
    description: 'Avoid congested areas. We highlight places with better population density for a calmer student life.',
    image: LANDING_IMAGES.studentLife,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            Everything you need for the{' '}
            <span className="text-black">best student life</span>
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto">
            From safety and transport to halal food and affordable rent — we help UK and Qatar students find the ideal place to live near their university.
          </p>
        </motion.div>

        <div className="space-y-24">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
              >
                <div className="flex-1">
                  <div
                    data-icon-box
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg mb-4"
                    style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                  >
                    <Icon size={28} style={{ color: 'inherit', flexShrink: 0 }} aria-hidden />
                  </div>
                <h3 className="text-2xl font-bold text-black mb-3">{f.title}</h3>
                <p className="text-black leading-relaxed">{f.description}</p>
              </div>
              <div className="flex-1 w-full max-w-lg">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-xl shadow-primary-200/30 border-2 border-primary-100"
                  onError={(e) => { const t = e.currentTarget; if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE }}
                />
              </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
