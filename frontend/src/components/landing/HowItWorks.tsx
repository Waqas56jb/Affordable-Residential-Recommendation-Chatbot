import { motion } from 'framer-motion'
import { HiOutlineSearch, HiOutlineMap, HiOutlineClipboardList, HiOutlineHome } from 'react-icons/hi'

const steps = [
  {
    icon: HiOutlineSearch,
    title: 'Choose country & university',
    text: 'Select UK or Qatar and enter your university or area. Set your budget and preferences.',
  },
  {
    icon: HiOutlineMap,
    title: 'See areas on the map',
    text: 'View neighbourhoods with real-time insights: distance, safety, transport, and cost.',
  },
  {
    icon: HiOutlineClipboardList,
    title: 'Compare & filter',
    text: 'Filter by halal food, gyms, masjids, low crime, and quality of life. Compare KPIs side by side.',
  },
  {
    icon: HiOutlineHome,
    title: 'Book your place',
    text: 'Shortlist the best apartments or student residences and connect with landlords or agents.',
  },
]

export function HowItWorks() {
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
            How it works
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Four simple steps to find your ideal student housing in the UK or Qatar.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-primary-200 -z-10" style={{ width: 'calc(100% + 2rem)', marginLeft: '1rem' }} />
              )}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-300/50 mb-6 mx-auto">
                <step.icon className="w-12 h-12 text-white" aria-hidden />
              </div>
              <div className="text-xl font-bold text-black mb-2">{step.title}</div>
              <p className="text-black text-sm leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
