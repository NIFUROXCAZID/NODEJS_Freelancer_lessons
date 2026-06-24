import express from 'express'
import cookieParser from 'cookie-parser'
import loggerConfig from '../config/logger.mjs'
// import dotenv from 'dotenv'
import { applySecurity } from './security/index.mjs'
import { setupStaticFiles } from './staticFiles.mjs'
import { attachUser } from './auth.middleware.mjs'


import { errorMiddlewareHandler } from './error/index.mjs'

const applyMiddleware = (app, opts = {}) => {
  // Завантаження змінних середовища
  // dotenv.config()

  // Підключення security middleware bundle (helmet, cors, rateLimit, body limits, requestId, env marker)
  applySecurity(app, opts.security)

  // 🔥 1. Middleware для парсингу cookies
  app.use(cookieParser())

  // 🔥 2. Парсинг JSON body (fetch, axios, API запити) Парсинг HTML form data (POST форми)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true, }))

  // 🔥 3. Middleware для аутентифікації та авторизації (depends on cookies!)
  app.use(attachUser)

  // 🔥 4. Middleware для логування запитів
  app.use(loggerConfig)

  // 🔥 5. Middleware для обробки статичних файлів (public, uploads)
  setupStaticFiles(app)
}

export { applyMiddleware, errorMiddlewareHandler }
