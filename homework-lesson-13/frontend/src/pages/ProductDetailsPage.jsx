import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProductById } from '../features/products/productsApi'
import { ROUTES } from '../shared/constants/routes'

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL

export default function ProductDetailsPage() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError('')

        const data = await getProductById(id)

        setProduct(data)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load product',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!product) {
    return <p>Product not found</p>
  }

  const imageSrc = product.photo
    ? `${UPLOADS_URL}${product.photo}`
    : '/images/photo-not-available.jpg'

  return (
    <main>
      <h1>Інформація про автомобіль</h1>

      <div>
        <p>Марка автомобіля: {product.title}</p>
        <p>Рік випуску: {product.year}</p>
        <p>Номер автомобіля: {product.number}</p>
        <p>Ціна: {product.price} $</p>
        <p>Марка авто: {product.brand?.name}</p>
        <p>Власник: {product.owner?.name}</p>
        <p>Місто: {product.owner?.location}</p>

        <div>
          <img
            src={imageSrc}
            alt={product.title}
            crossOrigin="anonymous"
            style={{ width: '120px', maxHeight: "80px" }}
          />
        </div>
      </div>

      <hr />

      <Link to={ROUTES.PRODUCTS}>
        До списку автомобілів
      </Link>
    </main>
  )
}