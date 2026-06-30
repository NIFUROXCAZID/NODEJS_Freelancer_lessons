import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { ROUTES } from '../constants/routes'

export default function RoleRoute({ roles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!roles.includes(user?.role)) {
    return <Navigate to={ROUTES.PRODUCTS} replace />
  }

  return <Outlet />
}