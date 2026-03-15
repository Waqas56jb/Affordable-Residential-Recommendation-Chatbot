import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPaperAirplane } from 'react-icons/hi'
import { APP_CONFIG } from '@/config'
import { postChat, type ChatMessage } from '@/services/chat'
import { MarkdownMessage } from './MarkdownMessage'
import { AnimatedChatIcon } from './AnimatedChatIcon'

const WELCOME_MESSAGE =
  "Hi! I'm the Student Stay assistant. Ask me anything about the site – how to find hotels, use the map, check crime in the UK, or explore student housing. How can I help?"

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError(null)
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    try {
      const nextMessages: ChatMessage[] = [...messages, userMsg]
      const { message } = await postChat(nextMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: message }])
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Failed to send. Try again.'
      setError(err)
      setMessages((prev) => [...prev, { role: 'assistant', content: `Sorry – ${err}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] md:right-8 md:w-[400px] z-[999] max-w-[calc(100vw-2rem)] rounded-2xl sm:rounded-3xl bg-white overflow-hidden border border-slate-200/80 flex flex-col"
            style={{
              top: '5rem',
              bottom: '5.5rem',
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05), 0 20px 40px -15px rgba(20,184,166,0.2)',
            }}
          >
            <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3.5 flex-shrink-0 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner border border-white/30 flex-shrink-0">
                  <AnimatedChatIcon size={24} variant="white" className="sm:w-7 sm:h-7" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs sm:text-sm drop-shadow-sm truncate">{APP_CONFIG.appName} Assistant</p>
                  <p className="text-[10px] sm:text-xs text-white/90">Ask anything — free to use</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 sm:p-2.5 rounded-xl text-white/90 hover:bg-white/25 hover:text-white transition flex-shrink-0 touch-manipulation"
                aria-label="Close chat"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50/50"
            >
              {messages.length === 0 && (
                <div className="flex gap-2 sm:gap-3">
                  <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 bg-gradient-to-br from-teal-100 to-emerald-100 border border-teal-200/50 shadow-sm">
                    <AnimatedChatIcon size={22} variant="teal" className="sm:w-6 sm:h-6" />
                  </span>
                  <div className="rounded-xl sm:rounded-2xl rounded-tl-md bg-white border border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3 shadow-md shadow-slate-200/50">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{WELCOME_MESSAGE}</p>
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 sm:gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {m.role === 'assistant' && (
                    <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex-shrink-0 bg-gradient-to-br from-teal-100 to-emerald-100 border border-teal-200/50 shadow-sm">
                      <AnimatedChatIcon size={18} variant="teal" className="sm:w-5 sm:h-5" />
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md ${
                      m.role === 'user'
                        ? 'rounded-tr-md bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-teal-500/20'
                        : 'rounded-tl-md bg-white border border-slate-100 text-slate-800 shadow-slate-200/50'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <MarkdownMessage content={m.content} />
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 sm:gap-3">
                  <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex-shrink-0 bg-gradient-to-br from-teal-100 to-emerald-100 border border-teal-200/50 shadow-sm">
                    <AnimatedChatIcon size={18} variant="teal" className="sm:w-5 sm:h-5 opacity-80 animate-pulse" />
                  </span>
                  <div className="rounded-2xl rounded-tl-md bg-white border border-slate-100 px-4 py-3 shadow-md shadow-slate-200/50">
                    <span className="inline-flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="flex-shrink-0 px-4 py-1 text-xs text-rose-600 bg-rose-50 border-t border-rose-100">
                {error}
              </p>
            )}
            <div className="flex-shrink-0 p-2.5 sm:p-3 border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Student Stay..."
                  className="flex-1 min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 sm:px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 shadow-sm"
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 disabled:opacity-50 disabled:pointer-events-none transition-all flex-shrink-0 touch-manipulation"
                  aria-label="Send"
                >
                  <HiPaperAirplane className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[999] flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-white overflow-hidden ring-4 ring-white border-2 border-teal-400/40 transition-all touch-manipulation"
        style={{
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #059669 100%)',
          boxShadow: '0 12px 40px -10px rgba(20,184,166,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 20px 50px -12px rgba(20,184,166,0.6)' }}
        whileTap={{ scale: 0.96 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <HiX className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
        ) : (
          <span className="relative z-10 flex items-center justify-center">
            <AnimatedChatIcon size={28} variant="white" className="sm:w-9 sm:h-9" />
          </span>
        )}
        {!open && (
          <span
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
            }}
          />
        )}
      </motion.button>
    </>
  )
}
