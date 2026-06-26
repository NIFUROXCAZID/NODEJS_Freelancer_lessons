/**
 * Middleware для обробки 404 Not Found
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function notFoundHandler(req, res, next) {
  const err = new Error('Page Not Found')
  err.status = 404
  next(err)
}
