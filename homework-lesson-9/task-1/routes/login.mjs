import express from 'express'
import LoginController from '../controllers/loginController.mjs'

const router = express.Router()

// форма логіну
router.get('/', LoginController.loginForm)

// обробка логіну
router.post('/', LoginController.login)

export default router