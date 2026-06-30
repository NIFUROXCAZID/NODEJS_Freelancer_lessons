import pool from '../db/mysqlPool.mjs'

export const getAllBrands = async () => {
  const [rows] = await pool.query(`
    SELECT id, name
    FROM brands
    ORDER BY name ASC
  `)

  return rows.map((brand) => ({
    id: brand.id,
    _id: brand.id,
    name: brand.name,
  }))
}

export const getBrandById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT id, name
    FROM brands
    WHERE id = ?
    `,
    [id],
  )

  const brand = rows[0]

  if (!brand) return null

  return {
    id: brand.id,
    _id: brand.id,
    name: brand.name,
  }
}

export const createBrand = async (brandData) => {
  const [result] = await pool.query(
    `
    INSERT INTO brands (name)
    VALUES (?)
    `,
    [brandData.name],
  )

  return getBrandById(result.insertId)
}

export const updateBrand = async (id, brandData) => {
  await pool.query(
    `
    UPDATE brands
    SET name = ?
    WHERE id = ?
    `,
    [brandData.name, id],
  )

  return getBrandById(id)
}

export const deleteBrand = async (id) => {
  const brand = await getBrandById(id)

  if (!brand) return null

  await pool.query(
    `
    DELETE FROM brands
    WHERE id = ?
    `,
    [id],
  )

  return brand
}