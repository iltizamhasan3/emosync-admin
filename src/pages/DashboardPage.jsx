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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Konten', value: stats?.total_konten ?? 0, color: 'bg-blue-500' },
    { label: 'Artikel', value: stats?.total_artikel ?? 0, color: 'bg-cyan-500' },
    { label: 'Video', value: stats?.total_video ?? 0, color: 'bg-purple-500' },
    { label: 'Kutipan', value: stats?.total_kutipan ?? 0, color: 'bg-green-500' },
  ]

  return (
    <div>
      <Header title="Dashboard" description="Ringkasan konten EmoSync" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${card.color}`} />
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {stats?.konten_terbaru?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Konten Terbaru</h2>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Judul</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Tipe</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Premium</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.konten_terbaru.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {CONTENT_TYPE_LABELS[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.is_premium ? (
                        <span className="text-amber-600">Premium</span>
                      ) : (
                        <span className="text-gray-400">Gratis</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
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
