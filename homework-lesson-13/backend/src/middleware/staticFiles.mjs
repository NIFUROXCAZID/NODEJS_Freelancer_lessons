import express from 'express'
import { uploadsPath } from '../core/path.mjs'

export function setupStaticFiles(app) {
  app.use('/uploads', express.static(uploadsPath))
}