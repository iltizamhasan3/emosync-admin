import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createContent } from '../../api/content'
import { uploadFile } from '../../api/upload'
import Header from '../../components/Header'
import { CONTENT_TYPES } from '../../utils/constants'

export default function ContentCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState({ thumbnail: false, video: false })

  const [form, setForm] = useState({
    title: '',
    description: '',
    full_content: '',
    type: 'ARTIKEL',
    is_premium: false,
    thumbnail_url: '',
    video_url: '',
  })

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e, field, fileType) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading((prev) => ({ ...prev, [field]: true }))
    try {
      const res = await uploadFile(file, fileType)
      updateField(field, res.data.url)
    } catch (err) {
      setError(`Upload ${field} gagal: ${err.response?.data?.message || err.message}`)
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createContent(form)
      navigate('/contents')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan konten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header title="Tambah Konten" description="Buat konten baru untuk EmoSync" />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipe Konten</label>
            <select
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ARTIKEL">Artikel</option>
              <option value="VIDEO">Video</option>
              <option value="KUTIPAN">Kutipan</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Judul</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Masukkan judul konten"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Deskripsi singkat"
            />
          </div>

          {(form.type === 'ARTIKEL' || form.type === 'KUTIPAN') && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {form.type === 'KUTIPAN' ? 'Kutipan' : 'Konten Lengkap'}
              </label>
              <textarea
                value={form.full_content}
                onChange={(e) => updateField('full_content', e.target.value)}
                rows={form.type === 'KUTIPAN' ? 3 : 10}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={
                  form.type === 'KUTIPAN'
                    ? 'Teks kutipan...'
                    : 'Tulis konten artikel di sini...'
                }
              />
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Thumbnail</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'thumbnail_url', 'thumbnail')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary"
              />
              {uploading.thumbnail && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </div>
            {form.thumbnail_url && (
              <img
                src={form.thumbnail_url}
                alt="preview"
                className="mt-2 h-20 rounded object-cover"
              />
            )}
          </div>

          {form.type === 'VIDEO' && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">File Video</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'video_url', 'video')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary"
                />
                {uploading.video && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
              </div>
              {form.video_url && (
                <p className="mt-1 text-xs text-green-600">✓ Video terupload</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_premium"
              checked={form.is_premium}
              onChange={(e) => updateField('is_premium', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_premium" className="text-sm text-gray-700">
              Konten Premium (hanya untuk pengguna premium)
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Konten'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/contents')}
            className="rounded-lg border px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
