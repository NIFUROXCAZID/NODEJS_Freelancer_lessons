import { Router } from 'express'
import AuthController from '../controllers/AuthController.mjs'
import { requireAuth } from '../middleware/auth.middleware.mjs'

const router = Router()

// Реєстрація
router.post('/register', AuthController.postRegister)

// Логін
router.post('/login', AuthController.postLogin)

// Вихід
router.post('/logout', AuthController.logout)

// Освіжити поточного користувача
router.post('/refresh', AuthController.refresh)

// Отримати поточного користувача
router.get('/me', requireAuth, AuthController.me)

export default router