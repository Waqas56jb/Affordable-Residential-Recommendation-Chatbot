import app from './src/app.js'
import { config } from './src/config.js'

const { port } = config

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
  console.log(`  Health:     http://localhost:${port}/health`)
  console.log(`  Lookup:     GET http://localhost:${port}/api/accommodation/destinations/lookup?query=London`)
  console.log(`  Search:     GET http://localhost:${port}/api/accommodation/search?dest_id=...&checkin=...&checkout=...`)
  console.log(`  Status:     GET http://localhost:${port}/api/accommodation/status`)
  console.log(`  Chat:       POST http://localhost:${port}/api/chat (body: { messages })`)
  console.log(`  Auth:       POST http://localhost:${port}/api/auth/signup | /login | /forgot-password`)
})
