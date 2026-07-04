import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ContentListPage from './pages/contents/ContentListPage'
import ContentCreatePage from './pages/contents/ContentCreatePage'
import ContentEditPage from './pages/contents/ContentEditPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="contents" element={<ContentListPage />} />
        <Route path="contents/create" element={<ContentCreatePage />} />
        <Route path="contents/:id/edit" element={<ContentEditPage />} />
      </Route>
    </Routes>
  )
}
