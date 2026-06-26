import { Router } from 'express'
import CartController from '../controllers/CartController.mjs'
import {
  requireAuth,
  requireRole,
} from '../middleware/auth.middleware.mjs'

const router = Router()

router.get('/', requireAuth, requireRole(['user']),
  CartController.getCart,
)

router.post(
  '/items/:productId',
  requireAuth,
  requireRole(['user']),
  CartController.addToCart,
)

router.patch(
  '/items/:productId/increase',
  requireAuth,
  requireRole(['user']),
  CartController.increase,
)

router.patch(
  '/items/:productId/decrease',
  requireAuth,
  requireRole(['user']),
  CartController.decrease,
)

router.delete(
  '/items/:productId',
  requireAuth,
  requireRole(['user']),
  CartController.remove,
)

router.delete(
  '/',
  requireAuth,
  requireRole(['user']),
  CartController.clear,
)

export default router