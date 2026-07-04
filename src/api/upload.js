import client from './client'

export const uploadFile = async (file, type) => {
  const form = new FormData()
  form.append('file', file)
  form.append('type', type)
  const res = await client.post('/admin/konten/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
