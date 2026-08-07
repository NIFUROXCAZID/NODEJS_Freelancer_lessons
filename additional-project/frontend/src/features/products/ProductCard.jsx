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
    <>
      <td>
        <img src={imageSrc} alt={product.title} crossOrigin="anonymous" style={{ width: "120px", maxHeight: "80px" }} />
      </td>
      <td>
        <div style={{ textAlign: "center" }}>
          <Link className="tableTitle" to={ROUTES.buildProductDetails(product._id)}>
            <span>{product.title}</span>
          </Link>
        </div>
      </td>
      <td>{product.year}</td>
      <td>{product.number}</td>
      <td>{product.price} $</td>
      <td>{product.brand?.name}</td>
      <td>{product.owner?.name}</td>
      <td>{product.owner?.location}</td>
      {user?.role === ROLES.USER && (
        <td>
          <div style={{ textAlign: "center" }}>
            <button className="userEditBtn" onClick={handleAddToCart}>
              <span>Додати в кошик</span>
            </button>
          </div>
        </td>
      )}
      {canManage && (
        <td>
          <div style={{ textAlign: "center" }}>
            <Link className="userEditBtn" to={ROUTES.buildProductEdit(product._id)}>
              Редагувати
            </Link>
          </div>
        </td>
      )}
      {canManage && (
        <td>
          <div style={{ textAlign: "center" }}>
            <button className="userEditBtn" type="button" onClick={handleDelete}>
              <span>Delete</span>
            </button>
          </div>
        </td>
      )}
    </>
  );
})

export default ProductCard