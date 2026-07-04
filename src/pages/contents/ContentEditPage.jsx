import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContent, updateContent } from '../../api/content'
import { uploadFile } from '../../api/upload'
import Header from '../../components/Header'

export default function ContentEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    getContent(id)
      .then((res) => {
        const c = res.data
        setForm({
          title: c.title || '',
          description: c.description || '',
          full_content: c.full_content || '',
          type: c.type || 'ARTIKEL',
          is_premium: c.is_premium || false,
          thumbnail_url: c.thumbnail_url || '',
          video_url: c.video_url || '',
        })
      })
      .catch((err) => setError('Gagal memuat konten.'))
      .finally(() => setLoading(false))
  }, [id])

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
      setError(`Upload ${field} gagal.`)
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await updateContent(id, form)
      navigate('/contents')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan konten.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <Header title="Edit Konten" description="Perbarui konten EmoSync" />

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
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                <p className="mt-1 text-xs text-green-600">✓ Video: {form.video_url}</p>
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
              Konten Premium
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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
