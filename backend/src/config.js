import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT) || 3000,
  stayApi: {
    baseUrl: process.env.STAYAPI_BASE_URL || 'https://api.stayapi.com/v1',
    apiKey: process.env.STAYAPI_API_KEY || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
  },
}

export function isStayApiConfigured() {
  return Boolean(config.stayApi.apiKey)
}
