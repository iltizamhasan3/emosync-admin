import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/contents', label: 'Contents' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="z-20 flex h-screen w-64 flex-col bg-[var(--color-canvas)] border-r border-[var(--color-hairline)]">
      <div className="flex items-center gap-3 px-8 py-10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <div>
          <h1 className="typography-title-md text-[var(--color-ink)] tracking-tight">Claude Admin</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 w-full text-left transition-all ${
                isActive
                  ? 'category-tab-active'
                  : 'category-tab'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--color-hairline)] p-4">
        <div className="mb-4 flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-dark)] typography-caption-uppercase text-[var(--color-on-dark)]">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate typography-title-sm text-[var(--color-ink)]">{user?.name || 'Admin'}</p>
            <p className="truncate typography-caption text-[var(--color-muted)]">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="button-secondary w-full"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
