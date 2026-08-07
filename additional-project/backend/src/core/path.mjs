// src/core/path.mjs

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '..', '..')

export const uploadsPath = path.join(rootDir, 'uploads')