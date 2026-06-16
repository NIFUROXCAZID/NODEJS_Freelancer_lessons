import { Router } from 'express'
import ProductsController from '../controllers/productsController.mjs'

import uploadMiddleWare from '../middleware/uploadMiddleware.js'
import { productValidationMiddleware } from '../middleware/productValidationMiddleware.js'
import { ProductValidationSchema } from '../validation/productValidationSchema.js'

// 🔐 auth middleware
import { requireAuth, requireRole, } from '../middleware/auth.middleware.mjs'

const router = Router()

router.get('/', requireAuth, ProductsController.getAllProducts)
router.get('/create', requireAuth, requireRole(['manager', 'admin']),
  ProductsController.getProductForm
)

router.get('/update/:id', requireAuth, requireRole(['manager', 'admin']),
  ProductsController.getProductForm
)

router.get('/:id', requireAuth, ProductsController.getProductById)

router.post('/create', requireAuth, requireRole(['manager', 'admin']),
  uploadMiddleWare.single('photo'),
  productValidationMiddleware(ProductValidationSchema, 'products/productForm'),
  ProductsController.createProduct
)

router.post('/update/:id', requireAuth, requireRole(['manager', 'admin']),
  uploadMiddleWare.single('photo'),
  productValidationMiddleware(ProductValidationSchema, 'products/productForm'),
  ProductsController.updateProduct
)

router.delete('/:id', requireAuth, requireRole(['manager', 'admin']),
  ProductsController.deleteProduct
)

export default router
