import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

interface AuthPanelProps {
  image: string
  imageAlt: string
  title: string
  lines: string[]
  subtitle?: string
}

export function AuthPanel({ image, imageAlt, title, lines, subtitle }: AuthPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 min-h-[calc(100vh-4rem)]">
      <motion.img
        src={image}
        alt={imageAlt}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-md">
          <motion.h2
            variants={item}
            className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight"
          >
            {title}
          </motion.h2>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              variants={item}
              className="text-primary-100 text-base sm:text-lg leading-relaxed mb-2"
            >
              {line}
            </motion.p>
          ))}
          {subtitle && (
            <motion.p variants={item} className="text-primary-200/90 text-sm mt-4">
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
