import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { __dirname } from './settings.mjs'
import multer from 'multer'

import indexRouter from './routes/index.mjs'
import productsRouter from './routes/productsRouter.mjs'

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'uploads')))
app.use('/uploads', express.static('uploads'))

// routes
app.use('/', indexRouter)
app.use('/products', productsRouter)

// 404
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {

  // MULTER ERROR
  if (err instanceof multer.MulterError) {

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).render('products/productForm', {
        errors: ['Файл занадто великий (макс. 5MB)'],
        product: req.body,
      })
    }

    return res.status(400).render('products/productForm', {
      errors: [err.message],
      product: req.body,
    })
  }

  // CUSTOM / ZOD / OTHER ERRORS
  return res.status(500).render('products/productForm', {
    errors: [err.message || 'Unknown error'],
    product: req.body,
  })
})

export default app
