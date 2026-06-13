import express from 'express'
import UserController from '../controllers/userController.mjs'
import UserValidator from '../validators/userValidator.mjs'

import multer from 'multer'
import UploadManager from '../utils/UploadManager.mjs'

const router = express.Router()

router.get('/', UserController.usersList)

router.get('/register/:id?', UserController.registerForm)

router.post(
  '/register/:id?',
  UploadManager.single('userImg'),
  UserValidator.validate,
  UserController.registerUser,
)

router.delete('/', UserController.deleteUser)

export default router
