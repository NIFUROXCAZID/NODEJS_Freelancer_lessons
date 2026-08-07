import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ProductForm from '../features/products/ProductForm'
import {
  createProduct,
  getBrands,
  getOwners,
} from '../features/products/productsApi'
import { ROUTES } from '../shared/constants/routes'

export default function ProductCreatePage() {
  const navigate = useNavigate()

  const [brands, setBrands] = useState([])
  const [owners, setOwners] = useState([])
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [brandsData, ownersData] = await Promise.all([
          getBrands(),
          getOwners(),
        ])

        setBrands(brandsData)
        setOwners(ownersData)
      } catch (error) {
        setServerError('Failed to load form data')
      } finally {
        setIsLoading(false)
      }
    }

    loadFormData()
  }, [])

  const handleCreate = async (data) => {
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

      await createProduct(formData)

      navigate(ROUTES.PRODUCTS)
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Failed to create product',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section>
        <p>Завантаження...</p>
      </section>
    );
  }

  return (
    <section style={{ textAlign: "center" }}>
      <h1>Додати автомобіль</h1>
      <ProductForm brands={brands} owners={owners} onSubmit={handleCreate} submitText="Створити" isSubmitting={isSubmitting} serverError={serverError} />
    </section>
  );
}