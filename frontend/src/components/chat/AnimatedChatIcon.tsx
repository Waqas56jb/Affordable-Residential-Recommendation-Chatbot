/**
 * Animated chat bubble icon for the chatbot widget.
 * Uses inline SVG + CSS for a smooth, professional look without external assets.
 */
import { memo, useId } from 'react'

const teal = '#14b8a6'
const white = '#ffffff'

interface AnimatedChatIconProps {
  className?: string
  size?: number
  /** Use white color (e.g. on gradient button) */
  variant?: 'teal' | 'white'
}

function AnimatedChatIconInner({ className = '', size = 32, variant = 'teal' }: AnimatedChatIconProps) {
  const id = useId().replace(/:/g, '')
  const stroke = variant === 'white' ? 'rgba(255,255,255,0.4)' : 'rgba(20,184,166,0.4)'

  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-chat-float"
      >
        <defs>
          <linearGradient id={`chatGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={variant === 'white' ? '#fff' : '#5eead4'} stopOpacity={variant === 'white' ? 1 : 0.9} />
            <stop offset="100%" stopColor={variant === 'white' ? 'rgba(255,255,255,0.9)' : '#14b8a6'} />
          </linearGradient>
          <filter id="chatGlow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M6 4a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h2v4l4-4h10a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H6z"
          fill={`url(#chatGrad-${id})`}
          stroke={stroke}
          strokeWidth="1"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
        <circle cx="11" cy="14" r="1.5" fill={variant === 'white' ? 'rgba(20,184,166,0.9)' : 'rgba(255,255,255,0.95)'} className="animate-pulse" style={{ animationDuration: '1.5s' }} />
        <circle cx="16" cy="14" r="1.5" fill={variant === 'white' ? 'rgba(20,184,166,0.9)' : 'rgba(255,255,255,0.95)'} className="animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
        <circle cx="21" cy="14" r="1.5" fill={variant === 'white' ? 'rgba(20,184,166,0.9)' : 'rgba(255,255,255,0.95)'} className="animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.4s' }} />
      </svg>
    </span>
  )
}

export const AnimatedChatIcon = memo(AnimatedChatIconInner)
