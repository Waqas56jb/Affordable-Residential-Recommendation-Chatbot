import bcrypt from 'bcryptjs'
import { query } from '../db.js'

const SALT_ROUNDS = 10

export async function signup({ email, name, password }) {
  const emailNorm = String(email).trim().toLowerCase()
  const nameNorm = String(name).trim()
  if (!emailNorm || !nameNorm || !password) {
    throw new Error('Email, name and password are required')
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS)
  const result = await query(
    `INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, name, created_at`,
    [emailNorm, nameNorm, password_hash]
  )
  const row = result.rows[0]
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at,
  }
}

export async function login({ email, password }) {
  const emailNorm = String(email).trim().toLowerCase()
  if (!emailNorm || !password) {
    throw new Error('Email and password are required')
  }

  const result = await query(
    'SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1',
    [emailNorm]
  )
  const row = result.rows[0]
  if (!row) {
    throw new Error('Invalid email or password')
  }
  const match = await bcrypt.compare(password, row.password_hash)
  if (!match) {
    throw new Error('Invalid email or password')
  }
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at,
  }
}

/** Verify email exists in DB; returns { success, exists } so frontend can show new-password form. */
export async function forgotPassword({ email }) {
  const emailNorm = String(email).trim().toLowerCase()
  if (!emailNorm) {
    throw new Error('Email is required')
  }

  const userResult = await query(
    'SELECT id FROM users WHERE email = $1',
    [emailNorm]
  )
  const exists = userResult.rows.length > 0
  return { success: true, exists }
}

/** Set new password for user identified by email (after email verified on forgot-password step). */
export async function resetPassword({ email, newPassword }) {
  const emailNorm = String(email).trim().toLowerCase()
  if (!emailNorm || !newPassword) {
    throw new Error('Email and new password are required')
  }
  if (String(newPassword).length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const userResult = await query(
    'SELECT id FROM users WHERE email = $1',
    [emailNorm]
  )
  const user = userResult.rows[0]
  if (!user) {
    throw new Error('No account found with this email')
  }

  const password_hash = await bcrypt.hash(String(newPassword), SALT_ROUNDS)
  await query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [password_hash, user.id]
  )
  return { success: true, message: 'Password updated. You can sign in now.' }
}
