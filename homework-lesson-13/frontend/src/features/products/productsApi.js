import { api } from '../../shared/api/axiosInstance'

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', {
    params,
  })

  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)

  return response.data
}

export const createProduct = async (formData) => {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)

  return response.data
}
// --ДОПОМІЖНІ---------------------------------------------------------------------
export const getBrands = async () => {
  const response = await api.get('/brands')
  return response.data
}

export const getOwners = async () => {
  const response = await api.get('/owners')
  return response.data
}