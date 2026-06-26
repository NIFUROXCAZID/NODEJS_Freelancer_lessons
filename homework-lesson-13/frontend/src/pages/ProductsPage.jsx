import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import ProductCard from '../features/products/ProductCard'
import ProductFilters from '../features/products/ProductFilters'
import {
  getBrands,
  getOwners,
  getProducts,
} from '../features/products/productsApi'

import { useAuth } from '../features/auth/useAuth'
import { ROLES } from '../shared/constants/roles'
import { ROUTES } from '../shared/constants/routes'
import Pagination from '../shared/components/Pagination'

const initialFilters = {
  brand: '',
  owner: '',
  minPrice: '',
  maxPrice: '',
  sortBy: '',
  sortOrder: 'asc',
}

const initialPagination = {
  page: 1,
  limit: 5,
  totalItems: 0,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false,
}

function buildParams(filters, page = 1, limit = 5) {
  const params = {
    page,
    limit,
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '') {
      params[key] = value
    }
  })

  if (!params.sortBy) {
    delete params.sortOrder
  }

  return params
}

export default function ProductsPage() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [owners, setOwners] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [pagination, setPagination] = useState(initialPagination)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const canManage =
    user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN

  const loadProducts = async (
    nextFilters = filters,
    page = pagination.page,
    limit = pagination.limit,
  ) => {
    try {
      setIsLoading(true)
      setError('')

      const data = await getProducts(
        buildParams(nextFilters, page, limit),
      )

      setProducts(data.items)
      setPagination(data.pagination)

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Помилка завантаження автомобілів',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [productsData, brandsData, ownersData] =
          await Promise.all([
            getProducts({
              page: initialPagination.page,
              limit: initialPagination.limit,
            }),
            getBrands(),
            getOwners(),
          ])

        setProducts(productsData.items)
        setPagination(productsData.pagination)
        setBrands(brandsData)
        setOwners(ownersData)
      } catch (err) {
        setError('Помилка завантаження даних')
      } finally {
        setIsLoading(false)
      }
    }

    loadPageData()
  }, [])

  const handleApplyFilters = (event) => {
    event.preventDefault()
    loadProducts(filters, 1, pagination.limit)
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    loadProducts(initialFilters, 1, pagination.limit)
  }

  const handlePageChange = (page) => {
    loadProducts(filters, page, pagination.limit)
  }

  const handleDeleted = (deletedId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedId),
    )
  }

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  return (
    <main>
      <h1>Список автомобілів</h1>

      {canManage && (
        <div>
          <Link to={ROUTES.PRODUCT_CREATE}>
            + Додати автомобіль
          </Link>
        </div>
      )}

      <hr />

      <ProductFilters
        brands={brands}
        owners={owners}
        filters={filters}
        onChange={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <hr />

      {error && <p>{error}</p>}

      {!products.length ? (
        <p>Автомобілі не знайдені</p>
      ) : (
        <>
          <table>
            <tbody>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDeleted={handleDeleted}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  )
}