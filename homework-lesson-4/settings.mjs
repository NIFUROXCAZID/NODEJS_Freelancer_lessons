import path from 'path'
// path.join('a', 'b') = a/b
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // отримати визначений шлях до файлу
const __dirname = path.dirname(__filename) // отримати назву каталогу

// const filePath = path.join(__dirname, '/data/productsData.json')
const filePath = path.join(__dirname, '/data/books.json')

export default {
  dataPath: filePath,
  //  '/data/productsData.json',
}

// централізованих налаштувань