// Controller -> "що треба зробити"
// Model -> "як працюють книги"
// DataFileManager -> "як працює файл"

import { title } from 'process'
import Product from '../models/productModels.mjs'

class ProductsController {
  static getAllProducts(req, res) {
    try {
      const products = Product.loadList()
      res.render('products/productsList', {
        title: 'Список товарів',
        products,
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
      Product.addNewProduct(req.body)
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
      Product.updateProduct(req.params.id, req.body)
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
      Product.deleteProductById(req.body.id)
      res.status(204).end()
    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при видаленні товару ',
        error,
      })
    }
  }

//   static searchProducts(req, res) {
//   try {
//     const { author, year } = req.query

//     let products = Product.loadList()

//     if (author) {
//       products = products.filter(product =>
//         product.author
//           .toLowerCase()
//           .includes(author.toLowerCase())
//       )
//     }

//     if (year) {
//       products = products.filter(product =>
//         product.year == year
//       )
//     }

//     res.render('products/productsList', {
//       title: 'Search result',
//       products
//     })

//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// }

  static searchProducts(req, res) {
    const products = Product.searchProducts(req.query)

    res.render('products/productsList', {
      title: 'Search result',
      products
    })
  }
  
}

export default ProductsController
