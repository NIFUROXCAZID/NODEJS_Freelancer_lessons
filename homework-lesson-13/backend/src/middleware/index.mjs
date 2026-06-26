import express from 'express'
import cookieParser from 'cookie-parser'
import loggerConfig from '../config/logger.mjs'

import { applySecurity } from './security/index.mjs'
import { setupStaticFiles } from './staticFiles.mjs'

import { errorMiddlewareHandler } from './error/index.mjs'

const applyMiddleware = (app, opts = {}) => {
  // Security middleware
  applySecurity(app, opts.security)

  // Cookies
  app.use(cookieParser())

  // Body parsers
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Logger
  app.use(loggerConfig)

  // Static files (/uploads)
  setupStaticFiles(app)
}

export { applyMiddleware, errorMiddlewareHandler }