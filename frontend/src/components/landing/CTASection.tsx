import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-primary-50 border-t border-primary-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-5">
            Find your best place to live
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto mb-10">
            Join thousands of UK and Qatar students who found affordable, safe, and convenient housing near their university.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 rounded-full font-bold text-lg px-8 py-4 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
            >
              Give it a try
              <HiArrowRight size={20} style={{ color: '#ffffff', flexShrink: 0 }} aria-hidden />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
