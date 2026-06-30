import pool from '../db/mysqlPool.mjs'

const mapUser = (row) => {
  if (!row) return null

  return {
    id: row.id,
    _id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

class UserSqlService {
  async getList() {
    const [rows] = await pool.query(`
      SELECT id, username, email, role, created_at, updated_at
      FROM users
    `)

    return rows.map(mapUser)
  }

  async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT id, username, email, password, role, created_at, updated_at
      FROM users
      WHERE id = ?
      `,
      [id],
    )

    return mapUser(rows[0])
  }

  async getByEmail(email) {
    const [rows] = await pool.query(
      `
      SELECT id, username, email, password, role, created_at, updated_at
      FROM users
      WHERE email = ?
      `,
      [email],
    )

    return mapUser(rows[0])
  }

  async create(data) {
    const [result] = await pool.query(
      `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [
        data.username,
        data.email,
        data.password,
        data.role || 'user',
      ],
    )

    return this.getById(result.insertId)
  }

  async update(id, data) {
    await pool.query(
      `
      UPDATE users
      SET username = ?, email = ?, role = ?
      WHERE id = ?
      `,
      [data.username, data.email, data.role, id],
    )

    return this.getById(id)
  }

  async deleteById(id) {
    const user = await this.getById(id)

    if (!user) return null

    await pool.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id],
    )

    return user
  }

  async getSafeUser(id) {
    const [rows] = await pool.query(
      `
      SELECT id, username, email, role, created_at, updated_at
      FROM users
      WHERE id = ?
      `,
      [id],
    )

    return mapUser(rows[0])
  }
}

export default new UserSqlService()