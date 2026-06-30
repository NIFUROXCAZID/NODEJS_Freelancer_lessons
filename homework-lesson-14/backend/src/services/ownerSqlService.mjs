import pool from '../db/mysqlPool.mjs'

export const getAllOwners = async () => {
  const [rows] = await pool.query(`
    SELECT id, name, location
    FROM owners
    ORDER BY name ASC
  `)

  return rows.map((owner) => ({
    id: owner.id,
    _id: owner.id,
    name: owner.name,
    location: owner.location,
  }))
}

export const getOwnerById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT id, name, location
    FROM owners
    WHERE id = ?
    `,
    [id],
  )

  const owner = rows[0]

  if (!owner) return null

  return {
    id: owner.id,
    _id: owner.id,
    name: owner.name,
    location: owner.location,
  }
}

export const createOwner = async (ownerData) => {
  const [result] = await pool.query(
    `
    INSERT INTO owners (name, location)
    VALUES (?, ?)
    `,
    [ownerData.name, ownerData.location],
  )

  return getOwnerById(result.insertId)
}

export const updateOwner = async (id, ownerData) => {
  await pool.query(
    `
    UPDATE owners
    SET name = ?, location = ?
    WHERE id = ?
    `,
    [ownerData.name, ownerData.location, id],
  )

  return getOwnerById(id)
}

export const deleteOwner = async (id) => {
  const owner = await getOwnerById(id)

  if (!owner) return null

  await pool.query(
    `
    DELETE FROM owners
    WHERE id = ?
    `,
    [id],
  )

  return owner
}