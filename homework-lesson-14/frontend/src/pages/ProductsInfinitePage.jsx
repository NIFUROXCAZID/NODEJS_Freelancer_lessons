import { useEffect, useRef, useState } from 'react'
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

const initialFilters = {
  brand: '',
  owner: '',
  minPrice: '',
  maxPrice: '',
  sortBy: '',
  sortOrder: 'asc',
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

export default function ProductsInfinitePage() {
  const { user } = useAuth()
  const loaderRef = useRef(null)

  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [owners, setOwners] = useState([])

  const [filters, setFilters] = useState(initialFilters)

  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [hasNextPage, setHasNextPage] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const observerRef = useRef(null)

  const canManage =
    user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN

  const loadProducts = async ({
    nextPage = 1,
    nextFilters = filters,
    replace = false,
  } = {}) => {
    try {
      setIsLoading(true)
      setError('')

      const data = await getProducts(
        buildParams(nextFilters, nextPage, limit),
      )

      setProducts((prevProducts) =>
        replace ? data.items : [...prevProducts, ...data.items],
      )

      setPage(data.pagination.page)
      setHasNextPage(data.pagination.hasNextPage)
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
    const element = loaderRef.current

    if (!element) return
    if (isLoading) return
    if (!hasNextPage) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadProducts({
          nextPage: page + 1,
          nextFilters: filters,
          replace: false,
        })
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isLoading, hasNextPage, page, filters])

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [brandsData, ownersData] = await Promise.all([
          getBrands(),
          getOwners(),
        ])

        setBrands(brandsData)
        setOwners(ownersData)

        await loadProducts({
          nextPage: 1,
          nextFilters: initialFilters,
          replace: true,
        })
      } catch {
        setError('Помилка завантаження даних')
      }
    }

    loadPageData()
  }, [])

  const lastElementRef = (node) => {
    if (isLoading) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadProducts({
          nextPage: page + 1,
          nextFilters: filters,
          replace: false,
        })
      }
    })

    if (node) {
      observerRef.current.observe(node)
    }
  }

  const handleApplyFilters = (event) => {
    event.preventDefault()

    setPage(1)
    setHasNextPage(true)

    loadProducts({
      nextPage: 1,
      nextFilters: filters,
      replace: true,
    })
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    setPage(1)
    setHasNextPage(true)

    loadProducts({
      nextPage: 1,
      nextFilters: initialFilters,
      replace: true,
    })
  }

  const handleDeleted = (deletedId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedId),
    )
  }

  return (
    <main>
      <h1>Список автомобілів — infinite scroll</h1>

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

      {!products.length && !isLoading ? (
        <p>Автомобілі не знайдені</p>
      ) : (
        <table>
          <tbody>
            {products.map((product, index) => {
              const isLast = index === products.length - 1

              return (
                <ProductCard
                  ref={isLast ? lastElementRef : null}
                  key={product._id}
                  product={product}
                  onDeleted={handleDeleted}
                />
              )
            })}
          </tbody>
          </table>
          
      )}

      <div ref={loaderRef} style={{ height: '40px' }} />

      {isLoading && <h3>Loading...</h3>}

      {!hasNextPage && products.length > 0 && (
        <p>Більше автомобілів немає</p>
      )}
    </main>
  )
}