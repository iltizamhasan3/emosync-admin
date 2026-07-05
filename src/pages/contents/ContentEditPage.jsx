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
      .catch(() => setError('Gagal memuat konten.'))
      .finally(() => setLoading(false))
  }, [id])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const MAX_FILE_SIZE = 100 * 1024 * 1024

  const validateFile = (file, fileType) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('File terlalu besar. Maksimal 100MB.')
      return false
    }
    if (fileType === 'thumbnail') {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowed.includes(file.type)) {
        setError('Tipe gambar tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.')
        return false
      }
    }
    if (fileType === 'video') {
      const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
      if (!allowed.includes(file.type)) {
        setError('Tipe video tidak didukung. Gunakan MP4, WebM, OGG, atau MOV.')
        return false
      }
    }
    return true
  }

  const handleFileUpload = async (e, field, fileType) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    if (!validateFile(file, fileType)) {
      e.target.value = ''
      return
    }

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary-disabled)] border-t-[var(--color-primary)]" />
      </div>
    )
  }

  return (
    <div>
      <Header title="Edit Konten" description="Perbarui konten EmoSync" />

      {error && (
        <div           className="mb-4 rounded-md border border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 typography-body-sm text-[var(--color-error)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="feature-card border border-[var(--color-hairline)] space-y-6">
          <div>
            <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">Tipe Konten</label>
            <select
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="text-input"
            >
              <option value="ARTIKEL">Artikel</option>
              <option value="VIDEO">Video</option>
              <option value="KUTIPAN">Kutipan</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">Judul</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              className="text-input"
            />
          </div>

          <div>
            <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              className="text-input py-2 h-auto"
            />
          </div>

          {(form.type === 'ARTIKEL' || form.type === 'KUTIPAN') && (
            <div>
              <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">
                {form.type === 'KUTIPAN' ? 'Kutipan' : 'Konten Lengkap'}
              </label>
              <textarea
                value={form.full_content}
                onChange={(e) => updateField('full_content', e.target.value)}
                rows={form.type === 'KUTIPAN' ? 3 : 10}
                className="text-input py-2 h-auto"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">Thumbnail</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'thumbnail_url', 'thumbnail')}
                className="w-full typography-body-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-surface-soft)] file:px-3 file:py-1 file:typography-caption file:text-[var(--color-ink)] file:cursor-pointer cursor-pointer"
              />
              {uploading.thumbnail && (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary-disabled)] border-t-[var(--color-primary)]" />
              )}
            </div>
            {form.thumbnail_url && (
              <img
                src={form.thumbnail_url}
                alt="preview"
                className="mt-4 h-20 rounded-md object-cover border border-[var(--color-hairline)]"
              />
            )}
          </div>

          {form.type === 'VIDEO' && (
            <div>
              <label className="mb-2 block typography-title-sm text-[var(--color-ink)]">File Video</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'video_url', 'video')}
                  className="w-full typography-body-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-surface-soft)] file:px-3 file:py-1 file:typography-caption file:text-[var(--color-ink)] file:cursor-pointer cursor-pointer"
                />
                {uploading.video && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary-disabled)] border-t-[var(--color-primary)]" />
                )}
              </div>
              {form.video_url && (
                <p className="mt-2 typography-caption text-[var(--color-success)]">✓ Video: {form.video_url}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_premium"
              checked={form.is_premium}
              onChange={(e) => updateField('is_premium', e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-hairline)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="is_premium" className="typography-body-sm text-[var(--color-ink)]">
              Konten Premium
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="button-primary"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/contents')}
            className="button-secondary"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
