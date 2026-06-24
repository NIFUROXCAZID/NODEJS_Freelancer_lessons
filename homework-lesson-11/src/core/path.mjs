import path from 'path'
import { fileURLToPath } from 'url'

// 🔥 ROOT PROJECT (src/)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '..')

// 📁 основні папки
export const viewsPath = path.join(rootDir, 'views')
export const publicPath = path.join(rootDir, 'public')
export const uploadsPath = path.join(rootDir, 'uploads')
