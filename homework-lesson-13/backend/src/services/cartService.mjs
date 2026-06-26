import Cart from '../models/Cart.mjs'
import Product from '../models/Product.js'

export const getCartByUserId = async (userId) => {
  return await Cart.findOne({ user: userId })
    .populate({
      path: 'items.product',
      populate: ['brand', 'owner'],
    })
    .lean()
}

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    })
  }

  return cart
}

export const addToCart = async (userId, productId) => {
  const product = await Product.findById(productId)

  if (!product) {
    return null
  }

  const cart = await getOrCreateCart(userId)

  const existingItem = cart.items.find(
    (item) => String(item.product) === String(productId),
  )

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.items.push({
      product: productId,
      quantity: 1,
    })
  }

  await cart.save()

  return await getCartByUserId(userId)
}

export const increaseQuantity = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  const item = cart.items.find(
    (item) => String(item.product) === String(productId),
  )

  if (!item) {
    return null
  }

  item.quantity += 1

  await cart.save()

  return await getCartByUserId(userId)
}

export const decreaseQuantity = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  const item = cart.items.find(
    (item) => String(item.product) === String(productId),
  )

  if (!item) {
    return null
  }

  item.quantity -= 1

  if (item.quantity <= 0) {
    cart.items = cart.items.filter(
      (cartItem) => String(cartItem.product) !== String(productId),
    )
  }

  await cart.save()

  return await getCartByUserId(userId)
}

export const removeFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = cart.items.filter(
    (item) => String(item.product) !== String(productId),
  )

  await cart.save()

  return await getCartByUserId(userId)
}

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)

  cart.items = []

  await cart.save()

  return await getCartByUserId(userId)
}