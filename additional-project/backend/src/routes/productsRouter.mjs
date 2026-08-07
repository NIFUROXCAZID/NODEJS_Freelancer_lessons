import { Router } from 'express'
import ProductsController from '../controllers/productsController.mjs'

import uploadMiddleWare from '../middleware/uploadMiddleware.js'
import { productValidationMiddleware } from '../middleware/productValidationMiddleware.js'
import { ProductValidationSchema } from '../validation/productValidationSchema.js'

import { requireAuth, requireRole, } from '../middleware/auth.middleware.mjs'

const router = Router()

// Отримати всі товари
router.get('/', requireAuth, ProductsController.getAllProducts)

// Отримати один товар
router.get('/:id', requireAuth, ProductsController.getProductById)

// Створити товар
router.post('/', requireAuth, requireRole(['manager', 'admin']),
  uploadMiddleWare.single('photo'),
  productValidationMiddleware(ProductValidationSchema),
  ProductsController.createProduct
)

// Оновити товар
router.put('/:id', requireAuth, requireRole(['manager', 'admin']),
  uploadMiddleWare.single('photo'),
  productValidationMiddleware(ProductValidationSchema),
  ProductsController.updateProduct
)

// Видалити товар
router.delete('/:id', requireAuth, requireRole(['manager', 'admin']),
  ProductsController.deleteProduct
)

export default router