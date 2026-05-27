import { Router } from 'express'
import ProductsController from '../controllers/productsController.mjs'
import uploadMiddleWare from '../middleware/uploadMiddleware.js'
import { checkSchema, validationResult } from 'express-validator'
import ProductValidator from '../models/productValidator.js'

const router = Router()

router.get('/', ProductsController.getAllProducts)
router.get('/create', ProductsController.getProductForm)

router.get('/update/:id', ProductsController.getProductForm)

router.get('/:id', ProductsController.getProductById)

router.post('/create',
  uploadMiddleWare.single('photo'),
  ProductValidator.productValidationSchema,
  ProductsController.createProduct
)

router.post('/update/:id',
  uploadMiddleWare.single('photo'),
  ProductValidator.productValidationSchema,
  ProductsController.updateProduct
)

router.delete('/', ProductsController.deleteProduct)

export default router
