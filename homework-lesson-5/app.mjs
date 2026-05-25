import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { __dirname } from './settings.mjs'

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

app.use('/', indexRouter)

app.use('/products', productsRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app


// Задача 1. Розробити додаток для автопарку (марка авто, рік випуску, номер, зображення) з такими функціональними можливостями:
// 1)додавання транспортного засобу
// 2)редагування
// 3)видалення
// 4)виведення списку
// Також є статичні сторінки:
// •	Home
// •	about