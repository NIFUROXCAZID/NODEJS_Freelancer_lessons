import Product from '../models/productModels.mjs'
import { deleteFileFromDir } from '../utils/utils.js'

class ProductsController {
  static getAllProducts(req, res) {
    try {
      const products = Product.loadList()
      res.render('products/productsList', {
        title: 'Список товарів',
        products,
        // errors: [],
      })
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка завантаження даних ',
        error,
      })
    }
  }

  static getProductById(req, res) {
    try {
      const product = Product.loadProductById(req.params.id)
      res.render('products/productDetail', {
        title: 'Інформація про товар',
        product,
        // errors: [],
      })
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка завантаженні інфомрації про товар ',
        error,
      })
    }
  }

  static getProductForm(req, res) {
    try {
      const product = req.params.id
        ? Product.loadProductById(req.params.id)
        : {}
      res.render('products/productForm', {
        product,
        // Щоб errors не був undefined
        errors: [],
      })
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка завантаженні інфомрації про товар ',
        error,
      })
    }
  }
  static createProduct(req, res) {
    try {
      const productData = req.body
      // if (req.file) productData.photo = req.file.filename
      if (req.file) {
        productData.photo = '/uploads/' + req.file.filename
      }

      Product.addNewProduct(productData)
      res.redirect('/products')
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при збереженні товару ',
        error,
      })
    }
  }

  static updateProduct(req, res) {
    try {
      const product = Product.loadProductById(req.params.id)

      if (product.photo) deleteFileFromDir('uploads', product.photo)

      const productData = req.body
      // if (req.file) productData.photo = req.file.filename
      if (req.file) {
        productData.photo = '/uploads/' + req.file.filename
      }

      Product.updateProduct(req.params.id, productData)
      res.redirect('/products')
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при збереженні товару ',
        error,
      })
    }
  }

  static deleteProduct(req, res) {
    try {
      const product = Product.loadProductById(req.body.id)

      if (product.photo) deleteFileFromDir('uploads', product.photo)

      Product.deleteProductById(req.body.id)
      res.status(204).end()
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при видаленні товару ',
        error,
      })
    }
  }
}

export default ProductsController
