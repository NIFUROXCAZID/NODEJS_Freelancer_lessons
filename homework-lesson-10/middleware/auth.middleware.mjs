import passport from 'passport'

/**
 * Додає користувача в шаблони (EJS)
 * res.locals.user доступний у всіх view
 */
export function attachUser(req, res, next) {
  res.locals.user = req.user || null
  next()
}

/**
 * Перевірка: чи користувач залогінений
 * Passport додає req.isAuthenticated()
 */
// /auth/login ТРЕБА ЩОБ БУЛО ПОВНЕ ПОСИЛАННЯ З УРАХУВАННЯМ ТОГО ЩО В APP
// І В EJS ТЕЖ
export function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/auth/login')
  }

  next()
}

/**
 * Перевірка ролей (user / manager / admin)
 * Використання:
 * requireRole(['admin'])
 * requireRole(['manager', 'admin'])
 */
export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.redirect('/auth/login')
    }

    const user = req.user

    if (!user || !roles.includes(user.role)) {
      return res.status(403).send('Forbidden')
    }

    next()
  }
}