import Product from '../models/Products.mjs'

class ProductsDBService {
  async getList(sortOrder = 'asc') {
    return await Product.find().sort({
      price: sortOrder === 'asc' ? 1 : -1,
    })
  }

  async create(data) {
    return await Product.create(data)
  }
  
}

export default new ProductsDBService()