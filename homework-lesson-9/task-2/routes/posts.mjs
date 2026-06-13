import express from 'express'
import PostsController from '../controllers/postsController.mjs'
import { validatePost } from '../validators/postValidator.mjs'
import UploadManager from '../utils/UploadManager.mjs'

const router = express.Router()

router.get('/', PostsController.getList)

router.get('/register/:id?', PostsController.registerForm)

router.post(
  '/register/:id?',
  UploadManager.single('img'),
  validatePost,
  PostsController.register,
)

router.delete('/', PostsController.delete)

router.post('/comments/:postId', PostsController.createComment)

router.delete('/comments/:postId', PostsController.deleteComment)

export default router
