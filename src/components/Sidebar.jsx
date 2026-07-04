import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '✨' },
  { to: '/contents', label: 'Contents', icon: '💿' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="z-20 flex h-screen w-72 flex-col glass border-r-white/5">
      <div className="flex items-center gap-3 px-6 py-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl shadow-lg shadow-primary/20">
          🎵
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">EmoSync</h1>
          <p className="text-xs font-medium text-primary-light">Admin Studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-sm font-bold text-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
