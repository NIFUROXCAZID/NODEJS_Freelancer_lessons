import TokenService from '../services/tokenService.mjs'
import UserDBService from '../services/userDBService.mjs'

// requireAuth → читає accessToken → перевіряє JWT → дістає user з БД → кладе в req.user
// requireRole → перевіряє req.user.role

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.accessToken

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    const decoded = TokenService.verifyAccess(token)

    const user = await UserDBService.getById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    req.user = user

    next()
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden',
      })
    }

    next()
  }
}