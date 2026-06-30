import { Link } from 'react-router-dom'
import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '../../shared/constants/routes'
import { ROLES } from '../../shared/constants/roles'
import { useAuth } from '../auth/useAuth'
import { deleteProduct } from './productsApi'
import { useCart } from '../cart/useCart'

const API_URL = import.meta.env.VITE_UPLOADS_URL

const ProductCard = forwardRef(function ProductCard(
  { product, onDeleted },
  ref,
) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const canManage =
    user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN

  const imageSrc = product.photo
    ? `${API_URL}${product.photo}`
    : '/images/photo-not-available.jpg'

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Видалити автомобіль?')

    if (!isConfirmed) return

    await deleteProduct(product._id)

    onDeleted(product._id)
  }

  const { addItem } = useCart()
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN)
      return
    }

    await addItem(product._id)
    alert('Товар додано в кошик')
  }

  // console.log(product.photo)
  // console.log(imageSrc)

  
  return (
    <tr>
      <td>
        <img
          src={imageSrc}
          alt={product.title}
          crossOrigin="anonymous"
          style={{ width: '120px', maxHeight: "80px" }}
        />
      </td>

      <td>
        <Link to={ROUTES.buildProductDetails(product._id)}>
          {product.title}
        </Link>
      </td>

      <td>{product.year}</td>

      <td>{product.number}</td>

      <td>{product.price} $</td>

      <td>{product.brand?.name}</td>

      <td>{product.owner?.name}</td>

      <td>{product.owner?.location}</td>
      
      {user?.role === ROLES.USER && (
        <button onClick={handleAddToCart}>
          Додати в кошик
        </button>
      )}
     
      {canManage && (
        <td>
          <Link to={ROUTES.buildProductEdit(product._id)}>
            Редагувати
          </Link>
        </td>
      )}

      {canManage && (
        <td>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </td>
      )}
    </tr>
  )
})

export default ProductCard