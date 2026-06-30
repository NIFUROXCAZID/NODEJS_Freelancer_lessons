import express from 'express'


import { applyMiddleware, errorMiddlewareHandler } from './middleware/index.mjs'

// Роути
import indexRouter from './routes/index.mjs'
import productsRouter from './routes/productsRouter.mjs'
import authRouter from './routes/auth.mjs'
import brandsRouter from './routes/brandsRouter.mjs'
import ownersRouter from './routes/ownersRouter.mjs'
import cartRouter from './routes/cartRouter.mjs'

const app = express()

// Використання допоміжних middleware
applyMiddleware(app)

//підключення роутів
app.use('/api', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/owners', ownersRouter)
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)


// Централізований error middleware (404 + error handler)
errorMiddlewareHandler(app)

export default app

// Потім можно видалить
// npm uninstall mongoose

// окей помилка Cast to ObjectId failed зникла, тепер показує машини тепер і реєструє юзера. Що далі треба робити