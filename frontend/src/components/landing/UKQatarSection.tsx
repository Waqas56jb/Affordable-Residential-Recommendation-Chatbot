import { motion } from 'framer-motion'
import { HiCheckCircle } from 'react-icons/hi'
import { LANDING_IMAGES, HERO_SLIDES } from '@/constants/images'

const FALLBACK_IMAGE = HERO_SLIDES[0]

const ukPoints = [
  'Universities across England, Scotland, Wales & NI',
  'Crime stats & safety indexes by postcode',
  'Cheap transport: buses, trains, cycling routes',
  'Halal food, supermarkets & restaurants nearby',
  'Water quality & air quality data',
  'Low-accident areas & good road networks',
  'Gyms, libraries, and student hubs',
]

const qatarPoints = [
  'Education City & other universities in Doha',
  'Safe, family-friendly neighbourhoods',
  'Metro & bus connectivity',
  'Halal dining & fresh food options',
  'Mosques & religious facilities',
  'Malls, gyms, and recreational spots',
  'Affordable student housing & shared options',
]

export function UKQatarSection() {
  return (
    <section className="py-16 lg:py-24 bg-primary-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            Built for UK & Qatar students
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto">
            Whether you study in the UK or Qatar, get tailored recommendations for housing that fits your budget, lifestyle, and campus location.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl overflow-hidden border-2 border-primary-100 shadow-xl shadow-primary-100/50"
          >
            <div className="relative h-56 sm:h-64">
              <img
                src={LANDING_IMAGES.london}
                alt="UK student housing"
                className="w-full h-full object-cover"
                onError={(e) => { const t = e.currentTarget; if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">United Kingdom</h3>
                <p className="text-primary-100 text-sm">Find housing near your UK university</p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <ul className="space-y-3">
                {ukPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <HiCheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-black">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl overflow-hidden border-2 border-primary-100 shadow-xl shadow-primary-100/50"
          >
            <div className="relative h-56 sm:h-64">
              <img
                src={LANDING_IMAGES.doha}
                alt="Qatar student housing"
                className="w-full h-full object-cover"
                onError={(e) => { const t = e.currentTarget; if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white">Qatar</h3>
                <p className="text-primary-100 text-sm">Find housing near Education City & more</p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <ul className="space-y-3">
                {qatarPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <HiCheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-black">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
