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
      .catch((err) => console.error('Dashboard fetch failed:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary-disabled)] border-t-[var(--color-primary)]" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Konten', value: stats?.total_konten ?? 0 },
    { label: 'Artikel', value: stats?.total_artikel ?? 0 },
    { label: 'Video', value: stats?.total_video ?? 0 },
    { label: 'Kutipan', value: stats?.total_kutipan ?? 0 },
  ]

  return (
    <div>
      <Header title="Dashboard" description="Ringkasan konten EmoSync" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {cards.map((card) => (
          <div key={card.label} className="feature-card border border-[var(--color-hairline)] transition-all hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="typography-caption-uppercase text-[var(--color-muted)]">{card.label}</span>
              </div>
              <p className="mt-4 typography-display-md text-[var(--color-ink)]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats?.konten_terbaru?.length > 0 && (
        <div className="mt-12 product-mockup-card-dark">
          <h2 className="mb-8 typography-title-lg text-[var(--color-on-dark)]">Konten Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left typography-body-sm">
              <thead className="border-b border-[var(--color-surface-dark-elevated)]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[var(--color-on-dark-soft)]">Judul</th>
                  <th className="px-6 py-4 font-semibold text-[var(--color-on-dark-soft)]">Tipe</th>
                  <th className="px-6 py-4 font-semibold text-[var(--color-on-dark-soft)]">Akses</th>
                  <th className="px-6 py-4 font-semibold text-[var(--color-on-dark-soft)]">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-surface-dark-elevated)]">
                {stats.konten_terbaru.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[var(--color-surface-dark-soft)]">
                    <td className="px-6 py-4 font-medium text-[var(--color-on-dark)]">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-[var(--color-surface-dark-elevated)] px-2.5 py-1 typography-caption text-[var(--color-on-dark)]">
                        {CONTENT_TYPE_LABELS[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_premium ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--color-accent-amber)]/20 px-2.5 py-1 typography-caption text-[var(--color-accent-amber)]">
                          Premium
                        </span>
                      ) : (
                        <span className="text-[var(--color-on-dark-soft)]">Gratis</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-on-dark-soft)]">
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
