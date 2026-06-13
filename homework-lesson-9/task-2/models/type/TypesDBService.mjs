import Type from './Type.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class TypesDBService extends MongooseCRUDManager {
  static async getList(arg = {}) {
    let filters = {}
    if (arg && typeof arg === 'object' && 'filters' in arg) {
      filters = arg.filters
    }
    try {
      const res = await Type.find(filters, { title: 1 })
      return res
    } catch (error) {
      return []
    }
  }
}

export default new TypesDBService(Type)
