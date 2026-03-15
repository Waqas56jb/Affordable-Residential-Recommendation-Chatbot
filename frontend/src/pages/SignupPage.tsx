import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from 'react-icons/hi'
import { ROUTES } from '@/routes'
import { AUTH_IMAGES } from '@/constants/images'
import { AuthPanel } from '@/components/auth/AuthPanel'
import { signup, setAuthUser, getAuthUser, getRedirectAfterLogin, setRedirectAfterLogin } from '@/services/auth'

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

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const user = getAuthUser()
  if (user) {
    const target = getRedirectAfterLogin() || ROUTES.DASHBOARD
    setRedirectAfterLogin(null)
    return <Navigate to={target} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signup(name, email, password)
      if (res.success && res.user) {
        setAuthUser(res.user)
        const target = getRedirectAfterLogin() || ROUTES.DASHBOARD
        setRedirectAfterLogin(null)
        navigate(target, { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      <AuthPanel
        image={AUTH_IMAGES.signup}
        imageAlt="Student life"
        title="Start your housing search today."
        lines={[
          'Create a free account to save your favourite areas, compare safety and transport, and get recommendations tailored to your university and budget.',
          'Join thousands of UK & Qatar students who found safe, affordable housing.',
        ]}
        subtitle="No credit card required."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-sm"
        >
          <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/80 border border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h1 className="text-2xl font-bold text-black mb-2">Create account</h1>
              <p className="text-black/80 text-sm leading-relaxed mb-6">
                Sign up to save listings and get personalised recommendations.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={formVariants} initial="hidden" animate="show">
                <motion.div variants={fieldVariants} className="mb-4">
                  <label htmlFor="signup-name" className="block text-sm font-semibold text-black mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-black placeholder:text-gray-400 bg-white"
                    />
                  </div>
                </motion.div>
                <motion.div variants={fieldVariants} className="mb-4">
                  <label htmlFor="signup-email" className="block text-sm font-semibold text-black mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.ac.uk"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-black placeholder:text-gray-400 bg-white"
                    />
                  </div>
                </motion.div>
                <motion.div variants={fieldVariants} className="mb-5">
                  <label htmlFor="signup-password" className="block text-sm font-semibold text-black mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-black placeholder:text-gray-400 bg-white"
                    />
                  </div>
                  <p className="text-xs text-black/70 mt-1">Use at least 8 characters.</p>
                </motion.div>
                {error && (
                  <motion.div variants={fieldVariants} className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </motion.div>
                )}
                <motion.div variants={fieldVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : undefined}
                    whileTap={!loading ? { scale: 0.98 } : undefined}
                    className="w-full py-3.5 rounded-xl font-bold text-base shadow-md inline-flex items-center justify-center gap-2 transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                    style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                    <HiArrowRight className="w-5 h-5" style={{ color: '#ffffff' }} />
                  </motion.button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-sm text-black"
            >
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-black hover:underline"
              >
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
