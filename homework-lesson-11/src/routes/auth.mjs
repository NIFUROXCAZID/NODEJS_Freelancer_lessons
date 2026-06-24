import { Router } from 'express'
import AuthController from '../controllers/AuthController.mjs'

const router = Router()

// =========================
// GET login page
// =========================
router.get('/login', AuthController.showLogin)

// =========================
// POST login (Passport)
// =========================
router.post('/login', AuthController.postLogin)

// =========================
// GET register page
// =========================
router.get('/register', AuthController.showRegister)

// =========================
// POST register (create user)
// =========================
router.post('/register', AuthController.postRegister)

// =========================
// POST logout
// =========================
router.post('/logout', AuthController.logout)

export default router