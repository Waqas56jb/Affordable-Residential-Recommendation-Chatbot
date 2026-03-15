import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiLockClosed, HiArrowLeft, HiArrowRight, HiCheck } from 'react-icons/hi'
import { ROUTES } from '@/routes'
import { AUTH_IMAGES } from '@/constants/images'
import { AuthPanel } from '@/components/auth/AuthPanel'
import { forgotPassword, resetPassword, getAuthUser } from '@/services/auth'

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

type Step = 'email' | 'new-password' | 'success'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (getAuthUser()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      if (res.exists) {
        setStep('new-password')
      } else {
        setError('No account found with this email.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(email, newPassword)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      <AuthPanel
        image={AUTH_IMAGES.forgotPassword}
        imageAlt="Student housing"
        title="Reset your password."
        lines={[
          'Enter the email linked to your account. If it exists, you can set a new password right here.',
          'No email sending — verify and reset in one flow.',
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

            {step === 'email' && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h1 className="text-2xl font-bold text-black mb-2">Forgot password?</h1>
                  <p className="text-black/80 text-sm leading-relaxed mb-6">
                    Enter your account email. If it exists, we’ll let you set a new password on the next step.
                  </p>
                </motion.div>

                <form onSubmit={handleVerifyEmail}>
                  <motion.div variants={formVariants} initial="hidden" animate="show">
                    {error && (
                      <motion.div variants={fieldVariants} className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                      </motion.div>
                    )}
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
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : undefined}
                        whileTap={!loading ? { scale: 0.98 } : undefined}
                        className="w-full py-3.5 rounded-xl font-bold text-base shadow-md transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                        style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                      >
                        {loading ? 'Checking…' : 'Verify email'}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </form>
              </>
            )}

            {step === 'new-password' && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h1 className="text-2xl font-bold text-black mb-2">Set new password</h1>
                  <p className="text-black/80 text-sm leading-relaxed mb-6">
                    Account found for <strong className="text-black">{email}</strong>. Enter and confirm your new password below.
                  </p>
                </motion.div>

                <form onSubmit={handleSetNewPassword}>
                  <motion.div variants={formVariants} initial="hidden" animate="show">
                    {error && (
                      <motion.div variants={fieldVariants} className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                      </motion.div>
                    )}
                    <motion.div variants={fieldVariants} className="mb-4">
                      <label htmlFor="new-password" className="block text-sm font-semibold text-black mb-1.5">
                        New password
                      </label>
                      <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          required
                          minLength={8}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-black placeholder:text-gray-400 bg-white"
                        />
                      </div>
                      <p className="text-xs text-black/70 mt-1">Use at least 8 characters.</p>
                    </motion.div>
                    <motion.div variants={fieldVariants} className="mb-5">
                      <label htmlFor="confirm-password" className="block text-sm font-semibold text-black mb-1.5">
                        Confirm password
                      </label>
                      <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          required
                          minLength={8}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-black placeholder:text-gray-400 bg-white"
                        />
                      </div>
                    </motion.div>
                    <motion.div variants={fieldVariants}>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : undefined}
                        whileTap={!loading ? { scale: 0.98 } : undefined}
                        className="w-full py-3.5 rounded-xl font-bold text-base shadow-md transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                        style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                      >
                        {loading ? 'Updating…' : 'Update password'}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </form>
              </>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <HiCheck className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-black mb-2">Password updated</h2>
                <p className="text-black/80 text-sm leading-relaxed mb-6">
                  Your password has been changed. You can now sign in with your new password.
                </p>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-base shadow-md transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  style={{ backgroundColor: '#14b8a6', color: '#ffffff' }}
                >
                  Sign in
                  <HiArrowRight className="w-5 h-5" style={{ color: '#ffffff' }} />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
