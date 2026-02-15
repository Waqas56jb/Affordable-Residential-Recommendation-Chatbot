import { motion } from 'framer-motion'
import { IconUniversities, IconListings, IconSafety, IconBudget } from '@/assets/icons/KpiIcons'

const kpis = [
  {
    Icon: IconUniversities,
    value: '50+',
    label: 'Universities covered',
    sub: 'UK & Qatar',
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    Icon: IconListings,
    value: '1,200+',
    label: 'Verified listings',
    sub: 'Near campuses',
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    Icon: IconSafety,
    value: '98%',
    label: 'Crime-free areas',
    sub: 'Safety-first',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    Icon: IconBudget,
    value: '£400',
    label: 'Avg. from',
    sub: 'Budget options',
    gradient: 'from-primary-400 to-primary-700',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function StatsKPIs() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
            Trusted by students across UK & Qatar
          </h2>
          <p className="text-black max-w-2xl mx-auto">
            Real-time insights on safety, transport, cost, and quality of life so you can choose the best place to live.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {kpis.map((k) => (
            <motion.div
              key={k.label}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 text-center border border-primary-100 shadow-lg shadow-primary-100/50 hover:shadow-xl hover:shadow-primary-200/50 transition-all duration-300"
            >
              <div
                data-icon-box
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl shadow-lg mb-3"
                style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
              >
                <k.Icon className="w-7 h-7 shrink-0" style={{ color: 'inherit' }} aria-hidden />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-black">{k.value}</div>
              <div className="font-semibold text-black mt-1">{k.label}</div>
              <div className="text-sm text-black">{k.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
