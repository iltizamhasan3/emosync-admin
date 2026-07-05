import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[var(--color-canvas)]">
      <div className="w-full max-w-md feature-card shadow-sm border border-[var(--color-hairline)]">
        <div className="mb-10 text-center">
          <img 
            src="/app_icon.jpg" 
            alt="EmoSync Logo" 
            className="mx-auto mb-6 rounded-2xl object-cover shadow-sm border border-[var(--color-hairline)]"
            style={{ width: '96px', height: '96px' }}
          />
          <h1 className="mb-3 typography-display-md">
            EmoSync Admin
          </h1>
          <p className="typography-body-md text-[var(--color-muted)]">Masuk untuk mengelola konten</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 typography-body-sm text-[var(--color-error)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-6">
            <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-input"
              placeholder="admin@emosync.com"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full mt-2"
          >
            {loading ? 'Memproses...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
