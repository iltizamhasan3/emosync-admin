import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-dark">
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/30 blur-[128px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 animate-pulse rounded-full bg-secondary/30 blur-[128px]" />
      
      <div className="z-10 w-full max-w-md p-6">
        <div className="glass-card rounded-3xl p-10">
          <div className="mb-10 text-center">
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl shadow-lg shadow-primary/30">
              🎵
            </span>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              EmoSync <span className="text-gradient">Admin</span>
            </h1>
            <p className="text-sm font-medium text-gray-400">Masuk untuk mengelola konten</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 outline-none"
                placeholder="admin@emosync.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk sekarang ✨'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
