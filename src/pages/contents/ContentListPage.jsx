import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getContents, deleteContent } from '../../api/content'
import Header from '../../components/Header'
import { CONTENT_TYPE_LABELS } from '../../utils/constants'

export default function ContentListPage() {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchContents = useCallback(async (pageNum = 1) => {
    setLoading(true)
    try {
      const params = { page: pageNum }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      const res = await getContents(params)
      setContents(res.data || [])
      setPagination(res.pagination || null)
      setPage(pageNum)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter])

  useEffect(() => {
    fetchContents(1)
  }, [typeFilter, fetchContents])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchContents(1)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteContent(deleteId)
      const currentTotal = pagination?.total ?? contents.length
      const newTotal = currentTotal - 1
      const lastPage = Math.max(1, Math.ceil(newTotal / (pagination?.per_page || 20)))
      if (page > lastPage) {
        await fetchContents(lastPage)
      } else {
        setContents((prev) => prev.filter((c) => c.id !== deleteId))
        setPagination((prev) => prev ? { ...prev, total: newTotal } : prev)
      }
      setDeleteId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteKeyDown = (e) => {
    if (e.key === 'Escape') {
      setDeleteId(null)
    }
  }

  const totalPages = pagination?.last_page ?? 1
  const currentPage = pagination?.current_page ?? page

  return (
    <div>
      <Header title="Kelola Konten" description="Tambah, edit, atau hapus konten EmoSync" />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 max-w-md gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul..."
            className="text-input"
          />
          <button
            type="submit"
            className="button-secondary"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-input pr-8 cursor-pointer"
          >
            <option value="">Semua Tipe</option>
            <option value="ARTIKEL">Artikel</option>
            <option value="VIDEO">Video</option>
            <option value="KUTIPAN">Kutipan</option>
          </select>

          <Link
            to="/contents/create"
            className="button-primary whitespace-nowrap"
          >
            + Tambah
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary-disabled)] border-t-[var(--color-primary)]" />
        </div>
      ) : contents.length === 0 ? (
        <div className="feature-card text-center py-16 border border-[var(--color-hairline)]">
          <p className="typography-body-md text-[var(--color-ink-muted)]">Belum ada konten. Mulai buat sesuatu yang luar biasa!</p>
        </div>
      ) : (
        <>
          <div className="feature-card border border-[var(--color-hairline)] px-0 py-0 overflow-hidden">
            <table className="w-full text-left typography-body-sm">
              <thead className="border-b border-[var(--color-hairline)] bg-[var(--color-canvas-soft)]">
                <tr>
                  <th className="px-6 py-4 typography-eyebrow text-[var(--color-ink-muted)]">Thumbnail</th>
                  <th className="px-6 py-4 typography-eyebrow text-[var(--color-ink-muted)]">Judul</th>
                  <th className="px-6 py-4 typography-eyebrow text-[var(--color-ink-muted)]">Tipe</th>
                  <th className="px-6 py-4 typography-eyebrow text-[var(--color-ink-muted)]">Akses</th>
                  <th className="px-6 py-4 typography-eyebrow text-[var(--color-ink-muted)]">Tanggal</th>
                  <th className="px-6 py-4 typography-eyebrow text-[var(--color-ink-muted)] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-hairline)]">
                {contents.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[var(--color-surface-soft)]">
                    <td className="px-6 py-4">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt=""
                          className="h-12 w-20 rounded-md object-cover border border-[var(--color-hairline)]"
                        />
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded-md bg-[var(--color-canvas)] text-[var(--color-ink-muted)] typography-caption border border-[var(--color-hairline)]">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 font-medium text-[var(--color-ink)]">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-[var(--color-canvas)] px-2.5 py-1 typography-caption text-[var(--color-ink)] border border-[var(--color-hairline)]">
                        {CONTENT_TYPE_LABELS[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_premium ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--color-accent-purple)]/10 px-2.5 py-1 typography-caption text-[var(--color-accent-purple-deep)]">
                          Premium
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-muted)]">Gratis</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-ink-muted)]">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/contents/${item.id}/edit`}
                          className="button-secondary px-3 py-1.5 h-auto text-[13px]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="rounded-md border border-[var(--color-accent-orange)] text-[var(--color-accent-orange-deep)] bg-transparent px-3 py-1.5 typography-button text-[13px] hover:bg-[var(--color-accent-orange)]/10 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => fetchContents(currentPage - 1)}
                disabled={currentPage <= 1}
                className="button-secondary px-3 py-1.5 h-auto text-[13px] disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-[var(--color-ink-faint)]">...</span>
                    )}
                    <button
                      onClick={() => fetchContents(p)}
                      className={`px-3 py-1.5 typography-button text-[13px] rounded-md transition-colors ${
                        p === currentPage
                          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                          : 'bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-soft)]'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => fetchContents(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="button-secondary px-3 py-1.5 h-auto text-[13px] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/50 backdrop-blur-sm p-4"
          onClick={() => setDeleteId(null)}
          onKeyDown={handleDeleteKeyDown}
          tabIndex={-1}
        >
          <div
            className="feature-card w-[90%] max-w-[400px] min-w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="typography-heading-2 text-[var(--color-ink)] mb-2">Hapus Konten?</h3>
            <p className="typography-body-md text-[var(--color-ink-muted)]">
              Yakin ingin menghapus konten ini? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-8 flex justify-around sm:justify-end gap-3 flex-wrap">
              <button
                onClick={() => setDeleteId(null)}
                className="button-secondary"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="button-primary !bg-[var(--color-accent-orange)] !text-[var(--color-on-primary)] hover:opacity-80"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
