import { APP_CONFIG } from '@/config'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const CHAT_URL = `${APP_CONFIG.apiBaseUrl.replace(/\/$/, '')}/chat`

export async function postChat(messages: ChatMessage[]): Promise<{ message: string }> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText || 'Chat request failed')
  return { message: data.message ?? '' }
}
