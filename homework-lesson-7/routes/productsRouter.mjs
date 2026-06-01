import { Router } from 'express'
import ProductsController from '../controllers/productsController.mjs'
import uploadMiddleWare from '../middleware/uploadMiddleware.js'
import { productValidationMiddleware } from '../middleware/productValidationMiddleware.js'
import { ProductValidationSchema } from '../validation/productValidationSchema.js'

const router = Router()

router.get('/', ProductsController.getAllProducts)
router.get('/create', ProductsController.getProductForm)

router.get('/update/:id', ProductsController.getProductForm)

router.get('/:id', ProductsController.getProductById)

router.post('/create', uploadMiddleWare.single('photo'),
  productValidationMiddleware(ProductValidationSchema, 'products/productForm'),
  ProductsController.createProduct
)

router.post('/update/:id', uploadMiddleWare.single('photo'),
  productValidationMiddleware(ProductValidationSchema, 'products/productForm'),
  ProductsController.updateProduct
)

router.delete('/', ProductsController.deleteProduct)

export default router
