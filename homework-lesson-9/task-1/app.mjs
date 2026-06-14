import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'
import { fileURLToPath } from 'url'

// routes
import indexRouter from './routes/index.mjs'
import loginRouter from './routes/login.mjs'
import productsRouter from './routes/products.mjs'

// db
import connectDB from './db/connectDB.mjs'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// connect MongoDB
connectDB()

// view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middlewares
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// session (IMPORTANT)
app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30 min
    },
  }),
)

// static files
app.use(express.static(path.join(__dirname, 'public')))

// routers
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/products', productsRouter)

// 404
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  })
})

export default app