import pool from '../db/mysqlPool.mjs'

const mapCartRows = (rows = []) => {
  const items = rows
    .filter((row) => row.product_id)
    .map((row) => ({
      product: {
        id: row.product_id,
        _id: row.product_id,
        title: row.title,
        year: row.year,
        number: row.number,
        price: Number(row.price),
        photo: row.photo,
        brand: row.brand_id
          ? {
            id: row.brand_id,
            _id: row.brand_id,
            name: row.brand_name,
          }
          : null,
        owner: row.owner_id
          ? {
            id: row.owner_id,
            _id: row.owner_id,
            name: row.owner_name,
            location: row.owner_location,
          }
          : null,
      },
      quantity: row.quantity,
    }))

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return {
    items,
    totalPrice,
    totalQuantity,
  }
}

export const getOrCreateCart = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT id, user_id
    FROM carts
    WHERE user_id = ?
    `,
    [userId],
  )

  if (rows[0]) return rows[0]

  const [result] = await pool.query(
    `
    INSERT INTO carts (user_id)
    VALUES (?)
    `,
    [userId],
  )

  return {
    id: result.insertId,
    user_id: userId,
  }
}

export const getCartByUserId = async (userId) => {
  const cart = await getOrCreateCart(userId)

  const [rows] = await pool.query(
    `
    SELECT
      cart_items.quantity,

      products.id AS product_id,
      products.title,
      products.year,
      products.number,
      products.price,
      products.photo,

      brands.id AS brand_id,
      brands.name AS brand_name,

      owners.id AS owner_id,
      owners.name AS owner_name,
      owners.location AS owner_location

    FROM carts

    LEFT JOIN cart_items
      ON carts.id = cart_items.cart_id

    LEFT JOIN products
      ON cart_items.product_id = products.id

    LEFT JOIN brands
      ON products.brand_id = brands.id

    LEFT JOIN owners
      ON products.owner_id = owners.id

    WHERE carts.id = ?
    `,
    [cart.id],
  )

  return mapCartRows(rows)
}

export const addToCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  const [products] = await pool.query(
    `
    SELECT id
    FROM products
    WHERE id = ?
    `,
    [productId],
  )

  if (!products[0]) return null

  await pool.query(
    `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE quantity = quantity + 1
    `,
    [cart.id, productId],
  )

  return getCartByUserId(userId)
}

export const increaseQuantity = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  await pool.query(
    `
    UPDATE cart_items
    SET quantity = quantity + 1
    WHERE cart_id = ? AND product_id = ?
    `,
    [cart.id, productId],
  )

  return getCartByUserId(userId)
}

export const decreaseQuantity = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  await pool.query(
    `
    UPDATE cart_items
    SET quantity = quantity - 1
    WHERE cart_id = ? AND product_id = ?
    `,
    [cart.id, productId],
  )

  await pool.query(
    `
    DELETE FROM cart_items
    WHERE cart_id = ? AND product_id = ? AND quantity <= 0
    `,
    [cart.id, productId],
  )

  return getCartByUserId(userId)
}

export const removeFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId)

  await pool.query(
    `
    DELETE FROM cart_items
    WHERE cart_id = ? AND product_id = ?
    `,
    [cart.id, productId],
  )

  return getCartByUserId(userId)
}

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)

  await pool.query(
    `
    DELETE FROM cart_items
    WHERE cart_id = ?
    `,
    [cart.id],
  )

  return getCartByUserId(userId)
}