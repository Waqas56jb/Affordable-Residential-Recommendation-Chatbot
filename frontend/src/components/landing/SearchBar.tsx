import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiSearch, HiLocationMarker } from 'react-icons/hi'
import { FaUniversity } from 'react-icons/fa'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'
import { cn } from '@/utils'

const places = ['UK', 'Qatar']
const budgetOptions = ['Under £500', '£500–£800', '£800–£1200', '£1200+']

export function SearchBar({ variant = 'hero', className }: { variant?: 'hero' | 'header'; className?: string }) {
  const [country, setCountry] = useState('UK')
  const [budget, setBudget] = useState('')
  const [nearUniversity, setNearUniversity] = useState('')

  const isCompact = variant === 'header'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={cn(
        'bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden',
        isCompact ? 'flex items-center gap-2 py-2 pl-4 pr-2' : 'p-4 sm:p-6',
        className
      )}
    >
      {!isCompact && (
        <div className="flex items-center gap-3 mb-4">
          <img src={LANDING_IMAGES.logo} alt="Student Stay" className="w-10 h-10 object-contain" />
          <span className="font-semibold text-gray-800">{APP_CONFIG.appName} – Find your place</span>
        </div>
      )}
      <div className={cn('flex flex-col gap-3', isCompact && 'flex-row gap-2 sm:gap-4')}>
        <div className={cn('flex flex-wrap gap-2', isCompact && 'flex-shrink-0')}>
          {places.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setCountry(p)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all',
                country === p
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-primary-50 text-primary-800 hover:bg-primary-100'
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className={cn('flex flex-col sm:flex-row gap-3', isCompact && 'sm:flex-row flex-1')}>
          <div className="relative flex-1">
            <FaUniversity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
            <input
              type="text"
              placeholder="University or area"
              value={nearUniversity}
              onChange={(e) => setNearUniversity(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            />
          </div>
          {!isCompact && (
            <div className="relative flex-1">
              <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none bg-white"
              >
                <option value="">Budget (monthly)</option>
                {budgetOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            <HiSearch className="w-5 h-5" />
            {isCompact ? 'Search' : 'Find housing'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
