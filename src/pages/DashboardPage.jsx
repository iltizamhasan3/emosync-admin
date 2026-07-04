import { useState, useEffect } from 'react'
import client from '../api/client'
import Header from '../components/Header'
import { CONTENT_TYPE_LABELS } from '../utils/constants'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Konten', value: stats?.total_konten ?? 0, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Artikel', value: stats?.total_artikel ?? 0, gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Video', value: stats?.total_video ?? 0, gradient: 'from-purple-500 to-indigo-500' },
    { label: 'Kutipan', value: stats?.total_kutipan ?? 0, gradient: 'from-pink-500 to-rose-500' },
  ]

  return (
    <div>
      <Header title="Dashboard ✨" description="Ringkasan konten EmoSync" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-white/5">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl transition-all group-hover:opacity-40`} />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${card.gradient}`} />
                <span className="text-sm font-medium text-gray-400">{card.label}</span>
              </div>
              <p className="mt-4 text-4xl font-bold tracking-tight text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats?.konten_terbaru?.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-white">Konten Terbaru 🔥</h2>
          <div className="glass overflow-hidden rounded-2xl border-white/5">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-300">Judul</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Tipe</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Akses</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.konten_terbaru.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light">
                        {CONTENT_TYPE_LABELS[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_premium ? (
                        <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                          Premium ✦
                        </span>
                      ) : (
                        <span className="text-gray-400">Gratis</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
