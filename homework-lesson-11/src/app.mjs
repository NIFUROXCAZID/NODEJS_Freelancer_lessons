import express from 'express'
import { viewsPath } from './core/path.mjs'

import dotenv from 'dotenv'
import connectDB from './db/connectDB.mjs'

import { applyMiddleware, errorMiddlewareHandler } from './middleware/index.mjs'

// Роути
// import routes from './src/v1/routes/index.mjs'
import indexRouter from './routes/index.mjs'
import productsRouter from './routes/productsRouter.mjs'
import authRouter from './routes/auth.mjs'

// Завантаження змінних середовища
dotenv.config()
const app = express()
//підключення бази даних
await connectDB();

// Для .ejs скоро прибирем
app.set('views', viewsPath)
app.set('view engine', 'ejs')


// Використання допоміжних middleware
applyMiddleware(app)


//підключення роутів
// app.use('/api/v1/', routes)
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/products', productsRouter)

// Централізований error middleware (404 + error handler)
errorMiddlewareHandler(app)

export default app

