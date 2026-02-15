import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { LANDING_IMAGES } from '@/constants/images'

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-primary-800">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0">
        <img
          src={LANDING_IMAGES.studentLife}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 to-primary-700/70" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
            Find your best place to live
          </h2>
          <p className="text-white text-lg max-w-2xl mx-auto mb-10 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
            Join thousands of UK and Qatar students who found affordable, safe, and convenient housing near their university.
          </p>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-white font-bold text-lg border-b-2 border-primary-400 hover:border-primary-300 transition-colors"
          >
            Give it a try
            <HiArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
