import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowDown, HiAcademicCap } from 'react-icons/hi'
import { HERO_SLIDES } from '@/constants/images'

const ROTATE_INTERVAL_MS = 5000
const textShadow = '0 2px 20px rgba(0,0,0,0.75)'

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-[82vh] max-h-[820px] min-h-[480px] flex flex-col justify-center overflow-hidden bg-gray-900 font-sans">
      {/* Backgrounds – contained to section, no extra spread */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_SLIDES.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              fetchPriority={i === 0 ? 'high' : undefined}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.15) 100%)' }}
              aria-hidden
            />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center text-center flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3 sm:gap-4"
          >
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 border border-white/40 text-xs font-semibold uppercase tracking-widest"
              style={{ textShadow }}
            >
              <HiAcademicCap className="w-3.5 h-3.5 text-primary-300" />
              {['UK', '&', 'Qatar', 'students'].map((word, i) => (
                <span key={i} className={i % 2 === 0 ? 'text-white' : 'text-black'}>{word}</span>
              ))}
            </motion.span>

            <h1
              className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight"
            >
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="block"
              >
                {['Find', 'the', 'best', 'place', 'to', 'live'].map((word, i) => (
                  <span
                    key={i}
                    className={i % 2 === 0 ? 'text-black' : 'text-white'}
                    style={{
                      textShadow: i % 2 === 0
                        ? '0 0 16px rgba(255,255,255,0.95), 0 1px 3px rgba(255,255,255,0.9)'
                        : '0 0 20px rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {word}{' '}
                  </span>
                ))}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="block font-black"
              >
                {['near', 'your', 'university'].map((word, i) => (
                  <span
                    key={i}
                    className={i % 2 === 0 ? 'text-black' : 'text-white'}
                    style={{
                      textShadow: i % 2 === 0
                        ? '0 0 16px rgba(255,255,255,0.95), 0 1px 3px rgba(255,255,255,0.9)'
                        : '0 0 20px rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {word}{' '}
                  </span>
                ))}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              className="text-sm sm:text-base text-white/95 font-medium max-w-lg mx-auto leading-snug"
              style={{ textShadow: '0 1px 10px rgba(0,0,0,0.6)' }}
            >
              Safe, affordable housing · Halal food · Great transport. Compare by safety, cost & distance to campus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.35 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 min-w-[180px] px-6 py-3 rounded-xl font-bold text-base shadow-xl border-2 border-primary-400 hover:scale-105 active:scale-100 transition-all duration-200"
                style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
              >
                Get started
                <HiArrowDown className="w-5 h-5" style={{ color: '#ffffff' }} />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 flex-shrink-0">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-white' : 'w-1 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
