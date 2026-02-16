import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import '@/styles/index.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <div style={{ padding: 24, fontFamily: 'system-ui', color: '#111' }}>
          <h1>Something went wrong</h1>
          <p>Refresh the page or try again. If the problem continues, check the browser console.</p>
          <a href="/" style={{ color: '#14b8a6' }}>Go to home</a>
        </div>
      }
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
