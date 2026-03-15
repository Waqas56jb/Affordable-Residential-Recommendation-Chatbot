/**
 * PostgreSQL client for Vercel Postgres or any Postgres (DATABASE_URL or POSTGRES_URL).
 */
import pg from 'pg'

const { Pool } = pg

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : null

export async function query(text, params) {
  if (!pool) throw new Error('Database not configured: set DATABASE_URL or POSTGRES_URL in .env')
  return pool.query(text, params)
}

export function isDbConfigured() {
  return Boolean(connectionString)
}
