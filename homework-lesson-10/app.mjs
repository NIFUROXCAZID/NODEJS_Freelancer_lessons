import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { __dirname } from './settings.mjs'
import multer from 'multer'
import passport from './config/passport.mjs'
import { sessionMiddleware } from "./config/session.mjs";

import indexRouter from './routes/index.mjs'
import productsRouter from './routes/productsRouter.mjs'
import authRouter from './routes/auth.mjs'
import { attachUser } from './middleware/auth.middleware.mjs'

import connectDB from './db/connectDB.mjs';

const app = express()
await connectDB();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  sessionMiddleware({
    secret: process.env.SESSION_SECRET || 'secret',
    isProd: process.env.NODE_ENV === 'production',
  }),
)

app.use(passport.initialize())
app.use(passport.session())
app.use(attachUser) // оце теж

app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'uploads')))
app.use('/uploads', express.static('uploads'))

// routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/products', productsRouter)

// 404
app.use((req, res, next) => {
  const err = new Error('Page Not Found')
  err.status = 404
  next(err)
})

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('\n========== ERROR ==========')
  console.error(err)
  console.error('===========================\n')

  // MULTER ERROR
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send(`
        <h1>400 Bad Request</h1>
        <p>Файл занадто великий (макс. 5MB)</p>
      `)
    }

    return res.status(400).send(`
      <h1>400 Bad Request</h1>
      <pre>${err.message}</pre>
    `)
  }

  // OTHER ERRORS
  return res.status(err.status || 500).send(`
    <h1>${err.status || 500} Error</h1>
    <pre>${err.stack}</pre>
  `)
})

export default app
