import { api } from '../../shared/api/axiosInstance'

export const getCart = async () => {
  const response = await api.get('/cart')
  return response.data
}

export const addToCart = async (productId) => {
  const response = await api.post(`/cart/items/${productId}`)
  return response.data
}

export const increaseQuantity = async (productId) => {
  const response = await api.patch(
    `/cart/items/${productId}/increase`,
  )

  return response.data
}

export const decreaseQuantity = async (productId) => {
  const response = await api.patch(
    `/cart/items/${productId}/decrease`,
  )

  return response.data
}

export const removeFromCart = async (productId) => {
  const response = await api.delete(
    `/cart/items/${productId}`,
  )

  return response.data
}

export const clearCart = async () => {
  const response = await api.delete('/cart')
  return response.data
}