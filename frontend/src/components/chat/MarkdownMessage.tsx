import type { ReactNode } from 'react'

/**
 * Renders chatbot assistant messages with simple markdown: **bold**, paragraphs, numbered lists.
 * No external dependency so it works even if react-markdown is not installed.
 */
function renderBold(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let remaining = text
  let key = 0
  while (remaining.length > 0) {
    const i = remaining.indexOf('**')
    if (i === -1) {
      parts.push(<span key={key++}>{remaining}</span>)
      break
    }
    if (i > 0) parts.push(<span key={key++}>{remaining.slice(0, i)}</span>)
    const end = remaining.indexOf('**', i + 2)
    if (end === -1) {
      parts.push(<span key={key++}>{remaining.slice(i)}</span>)
      break
    }
    parts.push(
      <strong key={key++} className="font-semibold text-slate-900">
        {remaining.slice(i + 2, end)}
      </strong>
    )
    remaining = remaining.slice(end + 2)
  }
  return parts
}

export function MarkdownMessage({ content }: { content: string }) {
  const blocks: React.ReactNode[] = []
  const lines = content.split(/\n/)
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      const listItems: ReactNode[] = []
      while (i < lines.length) {
        const l = lines[i]
        const m = l.trim().match(/^(\d+)\.\s+(.+)$/)
        if (!m) break
        listItems.push(
          <li key={key++} className="leading-relaxed">
            {renderBold(m[2])}
          </li>
        )
        i++
      }
      blocks.push(
        <ol key={key++} className="list-decimal list-inside mb-2 space-y-1 text-sm text-slate-800 pl-0">
          {listItems}
        </ol>
      )
      continue
    }

    blocks.push(
      <p key={key++} className="mb-2 last:mb-0 text-sm leading-relaxed text-slate-800">
        {renderBold(trimmed)}
      </p>
    )
    i++
  }

  return <div className="markdown-chat">{blocks}</div>
}
