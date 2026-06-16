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

  // 🔥 головний метод для passport login
  async getByEmail(email) {
    return await User.findOne({ email })
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
}

export default new UserDBService()