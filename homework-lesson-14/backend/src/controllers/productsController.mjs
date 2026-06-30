import { deleteFileFromDir } from '../utils/utils.js'

// import {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct as deleteProductService,
// } from '../services/productService.js'

import {
  createProductSql as createProduct,
  deleteProductSql as deleteProductService,
  getAllProductsSql as getAllProducts,
  getProductByIdSql as getProductById,
  updateProductSql as updateProduct,
} from '../services/productSqlService.mjs'

class ProductsController {
  static async getAllProducts(req, res) {
    try {
      const {
        brand,
        owner,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        page = 1,
        limit = 5,
      } = req.query

      const result = await getAllProducts({
        filters: {
          brand,
          owner,
          minPrice,
          maxPrice,
        },

        sortBy,
        sortOrder,

        page,
        limit,
      })

      return res.status(200).json(result)
    } catch (error) {
      console.log('GET PRODUCTS ERROR:', error)

      return res.status(500).json({
        message: error.message,
      })
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params

      const product = await getProductById(id)

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }

      return res.status(200).json(product)
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to load product',
      })
    }
  }

  static async createProduct(req, res) {
    try {
      const productData = {
        ...req.validatedData,
      }

      if (req.file) {
        productData.photo = '/uploads/' + req.file.filename
      }

      const product = await createProduct(productData)

      return res.status(201).json(product)
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to create product',
      })
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params

      const productFromDb = await getProductById(id)

      if (!productFromDb) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }

      const productData = {
        ...req.validatedData,
        photo: productFromDb.photo,
      }

      if (req.file) {
        deleteFileFromDir(productFromDb.photo)
        productData.photo = '/uploads/' + req.file.filename
      }

      const product = await updateProduct(id, productData)

      return res.status(200).json(product)
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to update product',
      })
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params

      const product = await getProductById(id)

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }

      if (product.photo) {
        deleteFileFromDir(product.photo)
      }

      await deleteProductService(id)

      return res.status(204).end()
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to delete product',
      })
    }
  }
}

export default ProductsController
