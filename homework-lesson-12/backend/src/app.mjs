import express from 'express'

import connectDB from './db/connectDB.mjs'

import { applyMiddleware, errorMiddlewareHandler } from './middleware/index.mjs'

// Роути
import indexRouter from './routes/index.mjs'
import productsRouter from './routes/productsRouter.mjs'
import authRouter from './routes/auth.mjs'
import brandsRouter from './routes/brandsRouter.mjs'
import ownersRouter from './routes/ownersRouter.mjs'

const app = express()
await connectDB();

// Використання допоміжних middleware
applyMiddleware(app)

//підключення роутів
app.use('/api', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/owners', ownersRouter)
app.use('/api/products', productsRouter)


// Централізований error middleware (404 + error handler)
errorMiddlewareHandler(app)

export default app

