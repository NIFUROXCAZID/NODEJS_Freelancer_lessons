import pool from '../db/mysqlPool.mjs'

const mapProductRow = (row) => ({
  id: row.id,
  _id: row.id,
  title: row.title,
  year: row.year,
  number: row.number,
  price: row.price,
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
})

const baseSelect = `
  SELECT
    products.id,
    products.title,
    products.year,
    products.number,
    products.price,
    products.photo,
    products.brand_id,
    products.owner_id,

    brands.name AS brand_name,

    owners.name AS owner_name,
    owners.location AS owner_location

  FROM products
  LEFT JOIN brands ON products.brand_id = brands.id
  LEFT JOIN owners ON products.owner_id = owners.id
`

const buildWhere = (filters = {}) => {
  const conditions = []
  const values = []

  if (filters.brand) {
    conditions.push('products.brand_id = ?')
    values.push(filters.brand)
  }

  if (filters.owner) {
    conditions.push('products.owner_id = ?')
    values.push(filters.owner)
  }

  if (filters.minPrice) {
    conditions.push('products.price >= ?')
    values.push(filters.minPrice)
  }

  if (filters.maxPrice) {
    conditions.push('products.price <= ?')
    values.push(filters.maxPrice)
  }

  return {
    whereSql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  }
}

const buildSort = (sortBy, sortOrder) => {
  const allowedSortFields = {
    price: 'products.price',
    year: 'products.year',
    title: 'products.title',
  }

  if (!sortBy || !allowedSortFields[sortBy]) {
    return 'ORDER BY products.id DESC'
  }

  const direction = sortOrder === 'desc' ? 'DESC' : 'ASC'

  return `ORDER BY ${allowedSortFields[sortBy]} ${direction}`
}

export const getAllProductsSql = async ({
  filters = {},
  sortBy = '',
  sortOrder = 'asc',
  page = 1,
  limit = 5,
} = {}) => {
  const currentPage = Number(page) || 1
  const perPage = Number(limit) || 5
  const offset = (currentPage - 1) * perPage

  const { whereSql, values } = buildWhere(filters)
  const sortSql = buildSort(sortBy, sortOrder)

  const [itemsRows] = await pool.query(
    `
    ${baseSelect}
    ${whereSql}
    ${sortSql}
    LIMIT ? OFFSET ?
    `,
    [...values, perPage, offset],
  )

  const [countRows] = await pool.query(
    `
    SELECT COUNT(*) AS totalItems
    FROM products
    ${whereSql}
    `,
    values,
  )

  const totalItems = countRows[0].totalItems
  const totalPages = Math.ceil(totalItems / perPage)

  return {
    items: itemsRows.map(mapProductRow),
    pagination: {
      page: currentPage,
      limit: perPage,
      totalItems,
      totalPages,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  }
}

export const getProductByIdSql = async (id) => {
  const [rows] = await pool.query(
    `
    ${baseSelect}
    WHERE products.id = ?
    `,
    [id],
  )

  if (!rows[0]) return null

  return mapProductRow(rows[0])
}

export const createProductSql = async (data) => {
  const [result] = await pool.query(
    `
    INSERT INTO products
      (title, year, number, price, photo, brand_id, owner_id)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.year,
      data.number,
      data.price,
      data.photo || null,
      data.brand,
      data.owner,
    ],
  )

  return getProductByIdSql(result.insertId)
}

export const updateProductSql = async (id, data) => {
  await pool.query(
    `
    UPDATE products
    SET
      title = ?,
      year = ?,
      number = ?,
      price = ?,
      photo = ?,
      brand_id = ?,
      owner_id = ?
    WHERE id = ?
    `,
    [
      data.title,
      data.year,
      data.number,
      data.price,
      data.photo || null,
      data.brand,
      data.owner,
      id,
    ],
  )

  return getProductByIdSql(id)
}

export const deleteProductSql = async (id) => {
  const product = await getProductByIdSql(id)

  if (!product) return null

  await pool.query(
    `
    DELETE FROM products
    WHERE id = ?
    `,
    [id],
  )

  return product
}