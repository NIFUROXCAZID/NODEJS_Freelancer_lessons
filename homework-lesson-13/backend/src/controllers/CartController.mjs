import {
  addToCart,
  clearCart,
  decreaseQuantity,
  getCartByUserId,
  increaseQuantity,
  removeFromCart,
} from '../services/cartService.mjs'

function buildCartResponse(cart) {
  const items = cart?.items || []

  const totalPrice = items.reduce((sum, item) => {
    const price = item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  const totalQuantity = items.reduce((sum, item) => {
    return sum + item.quantity
  }, 0)

  return {
    items,
    totalPrice,
    totalQuantity,
  }
}

class CartController {
  static async getCart(req, res) {
    try {
      const cart = await getCartByUserId(req.user._id)

      return res.status(200).json(buildCartResponse(cart))
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to load cart',
      })
    }
  }

  static async addToCart(req, res) {
    try {
      const { productId } = req.params

      const cart = await addToCart(req.user._id, productId)

      if (!cart) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }

      return res.status(200).json(buildCartResponse(cart))
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to add product to cart',
      })
    }
  }

  static async increase(req, res) {
    try {
      const { productId } = req.params

      const cart = await increaseQuantity(req.user._id, productId)

      if (!cart) {
        return res.status(404).json({
          message: 'Cart item not found',
        })
      }

      return res.status(200).json(buildCartResponse(cart))
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to increase quantity',
      })
    }
  }

  static async decrease(req, res) {
    try {
      const { productId } = req.params

      const cart = await decreaseQuantity(req.user._id, productId)

      if (!cart) {
        return res.status(404).json({
          message: 'Cart item not found',
        })
      }

      return res.status(200).json(buildCartResponse(cart))
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to decrease quantity',
      })
    }
  }

  static async remove(req, res) {
    try {
      const { productId } = req.params

      const cart = await removeFromCart(req.user._id, productId)

      return res.status(200).json(buildCartResponse(cart))
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to remove product from cart',
      })
    }
  }

  static async clear(req, res) {
    try {
      const cart = await clearCart(req.user._id)

      return res.status(200).json(buildCartResponse(cart))
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to clear cart',
      })
    }
  }
}

export default CartController