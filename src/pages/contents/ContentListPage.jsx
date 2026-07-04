import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getContents, deleteContent } from '../../api/content'
import Header from '../../components/Header'
import { CONTENT_TYPE_LABELS, CONTENT_TYPE_COLORS } from '../../utils/constants'

const typeColors = {
  ARTIKEL: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-purple-100 text-purple-700',
  KUTIPAN: 'bg-green-100 text-green-700',
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
      <Header title="Kelola Konten" description="Tambah, edit, atau hapus konten EmoSync" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul..."
            className="w-60 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Cari
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Semua Tipe</option>
            <option value="ARTIKEL">Artikel</option>
            <option value="VIDEO">Video</option>
            <option value="KUTIPAN">Kutipan</option>
          </select>

          <Link
            to="/contents/create"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + Tambah Konten
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : contents.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">Belum ada konten.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Thumbnail</th>
                <th className="px-4 py-3 font-medium text-gray-600">Judul</th>
                <th className="px-4 py-3 font-medium text-gray-600">Tipe</th>
                <th className="px-4 py-3 font-medium text-gray-600">Premium</th>
                <th className="px-4 py-3 font-medium text-gray-600">Dibuat</th>
                <th className="px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contents.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="h-10 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-medium">
                    {item.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        typeColors[item.type] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {CONTENT_TYPE_LABELS[item.type] || item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.is_premium ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        Premium
                      </span>
                    ) : (
                      <span className="text-gray-400">Gratis</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/contents/${item.id}/edit`}
                        className="rounded bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Hapus Konten</h3>
            <p className="mt-2 text-sm text-gray-500">
              Yakin ingin menghapus konten ini? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
