import ProductsDBService from '../services/ProductsDBService.mjs'

class ProductsController {
  static async getList(req, res) {
    try {
      const sortOrder = req.session.sortOrder || 'asc'

      const products = await ProductsDBService.getList(sortOrder)

      res.render('products/productsList', {
        products,
        user: req.session.userName,
      })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  static addForm(req, res) {
    res.render('products/addProductForm')
  }

  static async addProduct(req, res) {
    try {
      await ProductsDBService.create(req.body)

      req.session.sortOrder = 'desc'
      res.redirect('/products')
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default ProductsController