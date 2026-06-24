import TokenService from '../services/tokenService.mjs'

export function verifyAccessToken(req, res, next) {
  try {
    // беремо токен з cookies
    const token = req.cookies.accessToken

    if (!token) {
      return res.status(401).json({
        message: 'No access token provided',
      })
    }

    // перевіряємо токен
    const decoded = TokenService.validateAccessToken(token)

    // кладемо користувача в req
    req.user = decoded

    next()
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}