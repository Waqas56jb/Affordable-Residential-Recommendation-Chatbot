import express from 'express'
import cors from 'cors'
import accommodationRoutes from './routes/accommodation.routes.js'
import mapRoutes from './routes/map.routes.js'
import crimeRoutes from './routes/crime.routes.js'
import chatRoutes from './routes/chat.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Auth API: signup, login, forgot-password (PostgreSQL)
app.use('/api/auth', authRoutes)
// Mount accommodation API (destination lookup + hotel search)
app.use('/api/accommodation', accommodationRoutes)
// Map API: geocode, reverse, POIs, route (real-time OSM)
app.use('/api/map', mapRoutes)
app.use('/api/crime', crimeRoutes)
app.use('/api/chat', chatRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
