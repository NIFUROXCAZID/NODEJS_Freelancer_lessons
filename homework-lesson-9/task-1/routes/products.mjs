import express from 'express'
import ProductsController from '../controllers/productsController.mjs'
import ProductValidator from '../validators/productValidator.mjs'

const router = express.Router()

// список товарів
router.get('/', ProductsController.getList)

// форма додавання товару
router.get('/add', ProductsController.addForm)

// додавання товару
router.post(
  '/add',
  ProductValidator.validateProduct,
  ProductsController.addProduct,
)

export default router
