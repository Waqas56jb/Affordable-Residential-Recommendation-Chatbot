import { Router } from 'express'
import * as authService from '../services/auth.service.js'
import { isDbConfigured } from '../db.js'

const router = Router()

function dbGuard(req, res, next) {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: 'Database not configured. Set DATABASE_URL or POSTGRES_URL.' })
  }
  next()
}

router.post('/signup', dbGuard, async (req, res) => {
  try {
    const { email, name, password } = req.body || {}
    const user = await authService.signup({ email, name, password })
    res.status(201).json({ success: true, user })
  } catch (err) {
    if (err.message?.includes('duplicate key') || err.message?.includes('unique')) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }
    if (err.message) {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: 'Signup failed.' })
  }
})

router.post('/login', dbGuard, async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const user = await authService.login({ email, password })
    res.json({ success: true, user })
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({ error: err.message })
    }
    if (err.message) {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: 'Login failed.' })
  }
})

router.post('/forgot-password', dbGuard, async (req, res) => {
  try {
    const { email } = req.body || {}
    const result = await authService.forgotPassword({ email })
    res.json(result)
  } catch (err) {
    if (err.message) {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: 'Request failed.' })
  }
})

router.post('/reset-password', dbGuard, async (req, res) => {
  try {
    const { email, newPassword } = req.body || {}
    const result = await authService.resetPassword({ email, newPassword })
    res.json(result)
  } catch (err) {
    if (err.message) {
      return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: 'Request failed.' })
  }
})

export default router
