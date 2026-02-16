import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiArrowLeft } from 'react-icons/hi'
import { ROUTES } from '@/routes'
import { AUTH_IMAGES } from '@/constants/images'
import { AuthPanel } from '@/components/auth/AuthPanel'

const formVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const fieldVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      <AuthPanel
        image={AUTH_IMAGES.forgotPassword}
        imageAlt="Student housing"
        title="Reset your password in seconds."
        lines={[
          'Enter the email linked to your Student Stay account and we’ll send you a secure link to choose a new password.',
          'No stress — get back to finding your ideal place near campus.',
        ]}
        subtitle="We’re here to help you stay on track."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-sm"
        >
          <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/80 border border-gray-100">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-black font-medium text-sm mb-6 hover:underline"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>

            {!sent ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h1 className="text-2xl font-bold text-black mb-2">Forgot password?</h1>
                  <p className="text-black/80 text-sm leading-relaxed mb-6">
                    Enter your sign-in email and we’ll send you a secure link to reset your password. Check your inbox and spam folder.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                  <motion.div variants={formVariants} initial="hidden" animate="show">
                    <motion.div variants={fieldVariants} className="mb-5">
                      <label htmlFor="forgot-email" className="block text-sm font-semibold text-black mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="forgot-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@university.ac.uk"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-black placeholder:text-gray-400 bg-white"
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={fieldVariants}>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-xl font-bold text-base shadow-md transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                      >
                        Send reset link
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <HiMail className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-black mb-2">Check your email</h2>
                <p className="text-black/80 text-sm leading-relaxed mb-6">
                  We’ve sent a password reset link to <strong className="text-black">{email}</strong>. Click the link in that email to set a new password. If you don’t see it, check your spam folder.
                </p>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 font-semibold text-black hover:underline"
                >
                  <HiArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
