import { errorHandler } from './errorHandler.mjs'
import { notFoundHandler } from './notFoundHandler.mjs'
import multerError from './multerError.mjs'

// Централізований error middleware для app.use(errorMiddlewareHandler)
export function errorMiddlewareHandler(app) {
  // 404 handler (має бути після всіх роутів)
  // error handler (має бути після notFoundHandler)
  app.use(notFoundHandler)

  app.use(multerError)

  app.use(errorHandler)
}
