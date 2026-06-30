import pool from '../db/mysqlPool.mjs'

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../config/jwt.mjs'

class TokenSqlService {
  static generateTokens(user) {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    return {
      accessToken,
      refreshToken,
    }
  }

  static verifyAccess(token) {
    return verifyAccessToken(token)
  }

  static verifyRefresh(token) {
    return verifyRefreshToken(token)
  }

  static async saveRefreshToken(userId, token) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await pool.query(
      `
      INSERT INTO refresh_tokens (token, user_id, expires_at)
      VALUES (?, ?, ?)
      `,
      [token, userId, expiresAt],
    )
  }

  static async findRefreshToken(token) {
    const [rows] = await pool.query(
      `
      SELECT id, token, user_id, expires_at, created_at
      FROM refresh_tokens
      WHERE token = ?
      `,
      [token],
    )

    return rows[0] || null
  }

  static async removeRefreshToken(token) {
    await pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE token = ?
      `,
      [token],
    )
  }
}

export default TokenSqlService