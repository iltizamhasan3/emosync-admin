import client from './client'

export const loginAdmin = async (email, password) => {
  const res = await client.post('/admin/login', { email, password })
  return res.data
}

export const getAdminProfile = async () => {
  const res = await client.get('/admin/me')
  return res.data
}
