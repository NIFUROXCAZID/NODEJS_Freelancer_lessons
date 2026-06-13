import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { fileURLToPath } from 'url'
// --- routers ----
import indexRouter from './routes/index.mjs'
import usersRouter from './routes/users.mjs'
import typesRouter from './routes/types.mjs'
import postsRouter from './routes/posts.mjs'

import connectDB from './db/connectDB.mjs'

const app = express()
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory
app.use((req, res, next) => {
  req.__dirname = __dirname
  next()
})

connectDB()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Додаємо першу статичну папку
app.use(express.static(path.join(__dirname, 'public')))
// Додаємо другу статичну папку
app.use(express.static(path.join(__dirname, 'uploads')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/types', typesRouter)
app.use('/posts', postsRouter)

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
