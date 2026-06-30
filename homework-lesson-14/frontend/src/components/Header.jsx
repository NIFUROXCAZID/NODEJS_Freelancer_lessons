import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { ROUTES } from '../shared/constants/routes'
import { ROLES } from '../shared/constants/roles'
import { useCart } from '../features/cart/useCart'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  const canManageProducts =
    user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN

  const { totalQuantity } = useCart()
  
  return (
    <header>
      <nav
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          borderBottom: '1px solid #ccc',
        }}
      >
        <Link to={ROUTES.HOME}>Home</Link>
        <Link to={ROUTES.ABOUT}>About</Link>

        {isAuthenticated && (
          <Link to={ROUTES.PRODUCTS}>Products</Link>
        )}
        {isAuthenticated && (
          <Link to={ROUTES.PRODUCTS_INFINITE}>Products Infinite</Link>
        )}

        {canManageProducts && (
          <Link to={ROUTES.PRODUCT_CREATE}>Add Product</Link>
        )}

        {user?.role === ROLES.USER && (
          <Link to={ROUTES.CART}>
            Cart ({totalQuantity})
          </Link>
        )}

        {!isAuthenticated ? (
          <>
            <Link to={ROUTES.LOGIN}>Login</Link>
            <Link to={ROUTES.REGISTER}>Register</Link>
          </>
        ) : (
          <>
            <span>Hello, {user?.username}</span>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  )
}