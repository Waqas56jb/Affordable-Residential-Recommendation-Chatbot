import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      const message = this.state.error?.message ?? 'Unknown error'
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-primary-50/50">
          <div className="max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-primary-900 mb-2">Something went wrong</h2>
            <p className="text-primary-700 text-sm mb-4">
              The page ran into an error. Try refreshing or go back to search again.
            </p>
            <p className="text-xs text-left text-primary-600 bg-white/80 p-3 rounded mb-6 font-mono break-all">
              {message}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white"
              style={{ backgroundColor: '#14b8a6' }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
