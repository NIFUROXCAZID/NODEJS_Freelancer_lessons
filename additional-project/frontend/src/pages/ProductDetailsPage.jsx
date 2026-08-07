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
    return <section><p>Завантаження...</p></section>
  }

  if (error) {
    return <section><p>{error}</p></section>
  }

  if (!product) {
    return (
      <section>
        <p>Машину не знайдено</p>
      </section>
    );
  }

  const imageSrc = product.photo
    ? `${UPLOADS_URL}${product.photo}`
    : '/images/photo-not-available.jpg'

  return (
    <section style={{textAlign: "center"}}>
      <h1>Інформація про автомобіль</h1>
      <div className="centerBtn">
        <button className="defaultButton">
          <Link to={ROUTES.PRODUCTS}>До списку автомобілів</Link>
        </button>
      </div>
      <p>
        Марка автомобіля: <strong>{product.title}</strong>
      </p>
      <p>
        Рік випуску: <strong>{product.year}</strong>
      </p>
      <p>
        Номер автомобіля: <strong>{product.number}</strong>
      </p>
      <p>
        Ціна: <strong>{product.price}</strong> $
      </p>
      <p>
        Марка авто: <strong>{product.brand?.name}</strong>
      </p>
      <p>
        Постачальник: <strong>{product.owner?.name}</strong>
      </p>
      <p>
        Місто: <strong>{product.owner?.location}</strong>
      </p>
      <p>
        <stron>Фото</stron>
      </p>
      <img src={imageSrc} alt={product.title} crossOrigin="anonymous" style={{ width: "120px", maxHeight: "80px" }} />
    </section>
  );
}