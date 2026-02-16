import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { APP_CONFIG } from '@/config'
import { LANDING_IMAGES } from '@/constants/images'

const footerLinks = {
  product: [
    { label: 'Explore', href: '#features' },
    { label: 'UK universities', href: '#uk-qatar' },
    { label: 'Qatar universities', href: '#uk-qatar' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Insights & KPIs', href: '#insights' },
  ],
  features: [
    { label: 'Crime-free areas', href: '#features' },
    { label: 'Halal food & dining', href: '#features' },
    { label: 'Transport & roads', href: '#features' },
    { label: 'Facilities (gyms, masjid)', href: '#facilities' },
    { label: 'Affordable budget', href: '#features' },
  ],
  company: [
    { label: 'About us', href: '#' },
    { label: 'Contact', href: '#contact' },
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms of use', href: '#' },
  ],
}

const social = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={LANDING_IMAGES.logo} alt={APP_CONFIG.appName} className="w-12 h-12 object-contain brightness-0 invert opacity-90" />
              <span className="text-2xl font-bold text-white">{APP_CONFIG.appName}</span>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed max-w-sm mb-6">
              {APP_CONFIG.tagline}. Find affordable, safe student housing near universities in the UK and Qatar — crime-free areas, halal food, cheap transport, and quality life.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@studentstay.com" className="flex items-center gap-2 text-white hover:text-primary-200 transition">
                <HiMail className="w-5 h-5 flex-shrink-0 text-white" aria-hidden /> hello@studentstay.com
              </a>
              <a href="tel:+441234567890" className="flex items-center gap-2 text-white hover:text-primary-200 transition">
                <HiPhone className="w-5 h-5 flex-shrink-0 text-white" aria-hidden /> +44 123 456 7890
              </a>
              <span className="flex items-center gap-2 text-white">
                <HiLocationMarker className="w-5 h-5 flex-shrink-0 text-white" aria-hidden /> UK & Qatar
              </span>
            </div>
            <div className="flex gap-4 mt-6">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white hover:bg-primary-500 hover:text-white transition"
                >
                  <s.icon className="w-5 h-5 text-white" aria-hidden />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-primary-200 hover:text-white text-sm transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-primary-200 hover:text-white text-sm transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-primary-200 hover:text-white text-sm transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-300 text-sm">
            © {currentYear} {APP_CONFIG.appName}. All rights reserved.
          </p>
          <p className="text-primary-400 text-xs text-center sm:text-right">
            For UK & Qatar students — affordable, safe, and quality living near your university.
          </p>
        </div>
      </div>
    </footer>
  )
}
