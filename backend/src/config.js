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
  crime: {
    /** GitHub repo "owner/repo" for crime CSV data (backend/2025-12/2025-12/*-street.csv). */
    githubRepo: process.env.CRIME_GITHUB_REPO || 'Waqas56jb/Affordable-Residential-Recommendation-Chatbot',
    githubBranch: process.env.CRIME_GITHUB_BRANCH || 'main',
  },
}

export function isStayApiConfigured() {
  return Boolean(config.stayApi.apiKey)
}
