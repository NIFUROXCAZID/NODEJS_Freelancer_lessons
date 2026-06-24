import express from 'express'
import { publicPath, uploadsPath } from '../core/path.mjs'

export function setupStaticFiles(app) {
  app.use(express.static(publicPath))
  
  app.use('/uploads', express.static(uploadsPath))
}