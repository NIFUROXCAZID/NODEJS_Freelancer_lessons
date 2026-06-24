import User from '../models/User.mjs'

class UserDBService {
  // отримати всіх юзерів
  async getList(filters = {}) {
    return await User.find(filters)
  }

  // знайти по id
  async getById(id) {
    return await User.findById(id)
  }

  async getByEmail(email) {
    return await User.findOne({ email }).select('+password')
  }

  // створення юзера (реєстрація)
  async create(data) {
    return await User.create(data)
  }

  // оновлення
  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
  }

  // видалення
  async deleteById(id) {
    return await User.findByIdAndDelete(id)
  }

  async getSafeUser(id) {
    return await User.findById(id).select('-password')
  }
}

export default new UserDBService()