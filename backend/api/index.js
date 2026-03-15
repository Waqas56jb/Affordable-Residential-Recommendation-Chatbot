/**
 * Vercel serverless entry when backend is deployed with "backend" as root.
 * Load env (from Vercel Environment Variables or .env locally), then pass all requests to Express.
 */
import './../src/config.js'
import app from './../src/app.js'

export default app
