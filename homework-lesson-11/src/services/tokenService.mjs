import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../config/jwt.mjs'

class TokenService {
  /**
   * Створення пари токенів
   */
  static generateTokens(user) {
    const accessToken = generateAccessToken(user)

    const refreshToken = generateRefreshToken(user)

    return {
      accessToken,
      refreshToken,
    }
  }

  /**
   * Перевірка Access Token
   */
  static verifyAccess(token) {
    return verifyAccessToken(token)
  }

  /**
   * Перевірка Refresh Token
   */
  static verifyRefresh(token) {
    return verifyRefreshToken(token)
  }
}

export default TokenService