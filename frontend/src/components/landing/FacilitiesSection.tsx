import { motion } from 'framer-motion'
import {
  FaMosque,
  FaDumbbell,
  FaUtensils,
  FaShoppingCart,
  FaBus,
  FaShieldAlt,
  FaStore,
  FaHospital,
  FaUniversity,
} from 'react-icons/fa'
import { LANDING_IMAGES } from '@/constants/images'

const facilities = [
  { icon: FaMosque, title: 'Masjids & religious places', desc: 'Prayer facilities and Islamic centres nearby' },
  { icon: FaDumbbell, title: 'Gyms & fitness', desc: 'Gyms, parks, and sports facilities' },
  { icon: FaUtensils, title: 'Halal restaurants & cafes', desc: 'Quality halal food and fresh groceries' },
  { icon: FaShoppingCart, title: 'Shopping malls & stores', desc: 'General stores and supermarkets' },
  { icon: FaBus, title: 'Transport & connectivity', desc: 'Buses, metro, good roads, less congestion' },
  { icon: FaShieldAlt, title: 'Police & safety', desc: 'Low crime, safe neighbourhoods' },
  { icon: FaStore, title: 'General stores', desc: 'Daily essentials within reach' },
  { icon: FaHospital, title: 'Healthcare', desc: 'Clinics and hospitals nearby' },
  { icon: FaUniversity, title: 'Universities', desc: 'Nearest to your campus' },
]

export function FacilitiesSection() {
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
            All the facilities you need
          </h2>
          <p className="text-black max-w-2xl mx-auto">
            We factor in masjids, gyms, halal food, transport, police stations, shopping, and more so you get a complete picture of each area.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facilities.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-primary-100 hover:shadow-xl hover:shadow-primary-200/40 hover:border-primary-300 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-black">{f.title}</h3>
                <p className="text-sm text-black mt-1">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-6"
        >
          <div className="rounded-2xl overflow-hidden border border-primary-100 shadow-lg">
            <img src={LANDING_IMAGES.mosque} alt="Mosque" className="w-full h-48 object-cover" />
            <div className="p-4 bg-white">
              <p className="font-semibold text-black">Religious & community</p>
              <p className="text-sm text-black">Masjids and Islamic centres</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-primary-100 shadow-lg">
            <img src={LANDING_IMAGES.gym} alt="Gym" className="w-full h-48 object-cover" />
            <div className="p-4 bg-white">
              <p className="font-semibold text-black">Fitness & wellness</p>
              <p className="text-sm text-black">Gyms and parks nearby</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-primary-100 shadow-lg">
            <img src={LANDING_IMAGES.shopping} alt="Shopping" className="w-full h-48 object-cover" />
            <div className="p-4 bg-white">
              <p className="font-semibold text-black">Shopping & stores</p>
              <p className="text-sm text-black">Malls and general stores</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
