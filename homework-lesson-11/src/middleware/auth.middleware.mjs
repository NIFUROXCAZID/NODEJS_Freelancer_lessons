import TokenService from '../services/tokenService.mjs'
import UserDBService from '../services/userDBService.mjs'

export function attachUser(req, res, next) {
  res.locals.user = req.user || null
  next()
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.accessToken

    if (!token) {
      return res.redirect('/auth/login')
    }

    // const user = TokenService.verifyAccess(token)
    const decoded = TokenService.verifyAccess(token)

    const user = await UserDBService.getById(decoded.id)

    req.user = user
    res.locals.user = user

    // console.log('AUTH USER:', user)
    // console.log('DECODED TOKEN:', decoded)

    next()
  } catch (err) {
    // console.log('AUTH ERROR:', err.message)
    return res.redirect('/auth/login')
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    try {
      // console.log('ROLE CHECK USER:', req.user)

      if (!req.user) {
        return res.redirect('/auth/login')
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).send('Forbidden')
      }

      next()
    } catch (err) {
      // console.log('ROLE ERROR:', err.message)
      return res.redirect('/auth/login')
    }
  }
}