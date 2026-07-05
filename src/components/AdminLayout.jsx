import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-12">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
