import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] p-6">
          <div className="feature-card max-w-md text-center border border-[var(--color-hairline)]">
            <div className="mb-4 text-4xl">⚠️</div>
            <h1 className="typography-display-sm text-[var(--color-ink)] mb-2">Terjadi Kesalahan</h1>
            <p className="typography-body-md text-[var(--color-muted)] mb-8">
              Something went wrong. Coba refresh halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="button-primary"
            >
              Refresh Halaman
            </button>
            {this.props.fallback}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
