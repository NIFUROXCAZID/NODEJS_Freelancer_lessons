import { Router } from 'express'
import ProductsController from '../controllers/productsController.mjs'
import uploadMiddleWare from '../middleware/uploadMiddleware.js'

const router = Router()

router.get('/', ProductsController.getAllProducts)
router.get('/create', ProductsController.getProductForm)

router.get('/update/:id', ProductsController.getProductForm)

router.get('/:id', ProductsController.getProductById)

router.post(
  '/create',
  uploadMiddleWare.single('photo'),
  ProductsController.createProduct
)

router.post(
  '/update/:id',
  uploadMiddleWare.single('photo'),
  ProductsController.updateProduct
)

router.delete('/', ProductsController.deleteProduct)

export default router
