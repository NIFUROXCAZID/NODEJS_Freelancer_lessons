import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import indexRouter from './routes/index.mjs'
import productsRouter from './routes/products.mjs'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// static
app.use(express.static(path.join(__dirname, 'public')))

// form data
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/', indexRouter)
app.use('/products', productsRouter)

app.listen(3000, () => {
  console.log('Server: http://localhost:3000')
})