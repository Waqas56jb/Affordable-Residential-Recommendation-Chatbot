import express from 'express'
import OpenAI from 'openai'
import { config } from '../config.js'
import { CHATBOT_SYSTEM_PROMPT } from '../prompts/chatbot.system.js'

const router = express.Router()

function getOpenAI() {
  const apiKey = config.openai?.apiKey
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

/**
 * POST /api/chat
 * Body: { messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }> }
 * Builds full messages with system prompt first, then conversation history, then latest user message.
 * Returns: { message: string } or { error: string }
 */
router.post('/', async (req, res) => {
  try {
    const openai = getOpenAI()
    if (!openai) {
      return res.status(503).json({
        error: 'Chat is not configured. Add OPENAI_API_KEY to the server .env file.',
      })
    }

    const { messages: rawMessages } = req.body || {}
    const messages = Array.isArray(rawMessages) ? rawMessages : []

    const systemMessage = { role: 'system', content: CHATBOT_SYSTEM_PROMPT }
    const allowedRoles = new Set(['user', 'assistant', 'system'])
    const sanitized = messages
      .filter((m) => m && typeof m.content === 'string' && allowedRoles.has(m.role))
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 8000) }))

    const apiMessages = [systemMessage, ...sanitized]

    const completion = await openai.chat.completions.create({
      model: config.openai?.model || 'gpt-4o-mini',
      messages: apiMessages,
      max_tokens: 600,
      temperature: 0.6,
    })

    const choice = completion.choices?.[0]
    const content = choice?.message?.content?.trim() || 'I could not generate a reply. Please try again.'

    res.json({ message: content })
  } catch (err) {
    console.error('Chat error:', err.message)
    const status = err.status === 401 ? 401 : err.status === 429 ? 429 : 500
    res.status(status).json({
      error: err.message || 'Something went wrong. Please try again.',
    })
  }
})

export default router
