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
}

export default Product
