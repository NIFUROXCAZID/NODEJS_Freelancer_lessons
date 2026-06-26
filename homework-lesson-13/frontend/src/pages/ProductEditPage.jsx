import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ProductForm from '../features/products/ProductForm'
import {
  getBrands,
  getOwners,
  getProductById,
  updateProduct,
} from '../features/products/productsApi'
import { ROUTES } from '../shared/constants/routes'

export default function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [brands, setBrands] = useState([])
  const [owners, setOwners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [productData, brandsData, ownersData] = await Promise.all([
          getProductById(id),
          getBrands(),
          getOwners(),
        ])

        setProduct(productData)
        setBrands(brandsData)
        setOwners(ownersData)
      } catch (error) {
        setServerError(
          error.response?.data?.message || 'Failed to load product',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPageData()
  }, [id])

  const handleUpdate = async (data) => {
    try {
      setServerError('')
      setIsSubmitting(true)

      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('year', data.year)
      formData.append('number', data.number)
      formData.append('price', data.price)
      formData.append('brand', data.brand)
      formData.append('owner', data.owner)

      if (data.photo?.[0]) {
        formData.append('photo', data.photo[0])
      }

      await updateProduct(id, formData)

      navigate(ROUTES.PRODUCTS)
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Failed to update product',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (!product) {
    return <p>Product not found</p>
  }

  return (
    <main>
      <h1>Редагувати автомобіль</h1>

      <ProductForm
        defaultValues={product}
        brands={brands}
        owners={owners}
        onSubmit={handleUpdate}
        submitText="Оновити"
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </main>
  )
}