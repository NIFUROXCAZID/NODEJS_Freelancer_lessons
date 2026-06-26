import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../config/jwt.mjs'

import RefreshToken from '../models/RefreshToken.mjs'

class TokenService {
  static generateTokens(user) {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    return {
      accessToken,
      refreshToken,
    }
  }

  static async saveRefreshToken(userId, token) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    return await RefreshToken.create({
      user: userId,
      token,
      expiresAt,
    })
  }

  static async findRefreshToken(token) {
    return await RefreshToken.findOne({ token })
  }

  static async removeRefreshToken(token) {
    return await RefreshToken.deleteOne({ token })
  }

  static verifyAccess(token) {
    return verifyAccessToken(token)
  }

  static verifyRefresh(token) {
    return verifyRefreshToken(token)
  }
}

export default TokenService