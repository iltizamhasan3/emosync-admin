import client from './client'

export const getContents = async (params = {}) => {
  const res = await client.get('/admin/konten', { params })
  return res.data
}

export const getContent = async (id) => {
  const res = await client.get(`/admin/konten/${id}`)
  return res.data
}

export const createContent = async (data) => {
  const res = await client.post('/admin/konten', data)
  return res.data
}

export const updateContent = async (id, data) => {
  const res = await client.post(`/admin/konten/${id}`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return res.data
}

export const deleteContent = async (id) => {
  const res = await client.delete(`/admin/konten/${id}`)
  return res.data
}
