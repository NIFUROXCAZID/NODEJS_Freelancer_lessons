import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { ROUTES } from '../shared/constants/routes'

export default function RoleRoute({ roles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <section><p>Завантаження...</p></section>
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!roles.includes(user?.role)) {
    return <Navigate to={ROUTES.PRODUCTS} replace />
  }

  return <Outlet />
}