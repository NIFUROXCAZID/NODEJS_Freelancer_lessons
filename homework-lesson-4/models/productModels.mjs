// Controller -> "що треба зробити"
// Model -> "як працюють книги"
// DataFileManager -> "як працює файл"

import dataFileManager from '../services/DataFileManager.js'

class Product {
  static loadList() {
    return dataFileManager.loadData()
  }
  static loadProductById(id) {
    return dataFileManager.getItemById(id)
  }
  static addNewProduct(data) {
    dataFileManager.addItem({
      id: new Date().getTime(),
      ...data,
    })
  }
  static deleteProductById(id) {
    dataFileManager.deleteItemById(id)
  }

  static updateProduct(id, data) {
    dataFileManager.updateItemById(id, data)
  }

//   static searchByAuthor(author) {
//   const products = dataFileManager.loadData()

//   return products.filter(product =>
//     product.author
//       .toLowerCase()
//       .includes(author.toLowerCase())
//   )
// }

//   static filterByYear(year) {
//   const products = dataFileManager.loadData()

//   return products.filter(product =>
//     product.year == year
//   )
//   }
  
  static searchProducts(filters) {
    let products = dataFileManager.loadData()

    if (filters.author) {
      products = products.filter(product =>
        product.author
          .toLowerCase()
          .includes(filters.author.toLowerCase())
      )
    }

    if (filters.year) {
      products = products.filter(product =>
        product.year == filters.year
      )
    }

    return products
  }

}

export default Product
