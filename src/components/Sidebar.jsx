import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/contents', label: 'Konten', icon: '📝' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-white">
      <div className="flex items-center gap-2 border-b border-gray-700 p-5">
        <span className="text-2xl">🎵</span>
        <div>
          <h1 className="text-lg font-bold">EmoSync</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
