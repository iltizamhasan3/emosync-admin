import { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin, getAdminProfile } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      getAdminProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await loginAdmin(email, password)
    localStorage.setItem('admin_token', res.data.token)
    localStorage.setItem('admin_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
