import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getContents, deleteContent } from '../../api/content'
import Header from '../../components/Header'
import { CONTENT_TYPE_LABELS } from '../../utils/constants'

const typeColors = {
  ARTIKEL: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
  VIDEO: 'border-purple-500/20 bg-purple-500/10 text-purple-400',
  KUTIPAN: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
}

export default function ContentListPage() {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchContents = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      const res = await getContents(params)
      setContents(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [typeFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchContents()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteContent(deleteId)
      setContents((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <Header title="Kelola Konten 💿" description="Tambah, edit, atau hapus konten EmoSync" />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 max-w-md gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul..."
            className="glass-input w-full rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="glass-input cursor-pointer appearance-none rounded-xl px-4 py-2.5 pr-8 text-sm outline-none"
          >
            <option value="" className="bg-bg-dark text-white">Semua Tipe</option>
            <option value="ARTIKEL" className="bg-bg-dark text-white">Artikel</option>
            <option value="VIDEO" className="bg-bg-dark text-white">Video</option>
            <option value="KUTIPAN" className="bg-bg-dark text-white">Kutipan</option>
          </select>

          <Link
            to="/contents/create"
            className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
          >
            + Tambah
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      ) : contents.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <p className="text-gray-400">Belum ada konten. Mulai buat sesuatu yang luar biasa! ✨</p>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-300">Thumbnail</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Judul</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Tipe</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Akses</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contents.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="h-12 w-20 rounded-lg object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-white/5 text-xs text-gray-500 ring-1 ring-white/10">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 font-medium text-white">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        typeColors[item.type] || 'border-gray-500/20 bg-gray-500/10 text-gray-400'
                      }`}
                    >
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
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/contents/${item.id}/edit`}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-light transition-colors hover:bg-primary/20"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
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
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-sm rounded-3xl p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400 ring-1 ring-red-500/20">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-white">Hapus Konten?</h3>
            <p className="mt-2 text-sm text-gray-400">
              Yakin ingin menghapus konten ini? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-600 hover:shadow-red-500/40 disabled:opacity-50"
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
