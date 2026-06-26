import { useEffect, useState } from 'react'

import { useAuth } from '../auth/useAuth'
import { CartContext } from './CartContext'
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  getCart,
  increaseQuantity,
  removeFromCart,
} from './cartApi'

const initialCart = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
}

export default function CartProvider({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const [cart, setCart] = useState(initialCart)
  const [isCartLoading, setIsCartLoading] = useState(false)

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthLoading) return

      if (!isAuthenticated) {
        setCart(initialCart)
        return
      }

      try {
        setIsCartLoading(true)

        const data = await getCart()
        setCart(data)
      } catch (error) {
        setCart(initialCart)
      } finally {
        setIsCartLoading(false)
      }
    }

    loadCart()
  }, [isAuthenticated, isAuthLoading])

  const addItem = async (productId) => {
    const data = await addToCart(productId)
    setCart(data)
    return data
  }

  const increaseItem = async (productId) => {
    const data = await increaseQuantity(productId)
    setCart(data)
    return data
  }

  const decreaseItem = async (productId) => {
    const data = await decreaseQuantity(productId)
    setCart(data)
    return data
  }

  const removeItem = async (productId) => {
    const data = await removeFromCart(productId)
    setCart(data)
    return data
  }

  const clear = async () => {
    const data = await clearCart()
    setCart(data)
    return data
  }

  const value = {
    cart,
    setCart,
    isCartLoading,

    items: cart.items,
    totalPrice: cart.totalPrice,
    totalQuantity: cart.totalQuantity,

    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clear,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}