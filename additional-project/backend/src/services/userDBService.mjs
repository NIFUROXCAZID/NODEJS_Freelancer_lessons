import User from '../models/User.mjs'

class UserDBService {
  async getList(filters = {}) {
    return await User.find(filters).select('-password').lean()
  }

  async getById(id) {
    return await User.findById(id).select('-password').lean()
  }

  async getByEmail(email) {
    return await User.findOne({ email }).select('+password')
  }

  async create(data) {
    return await User.create(data)
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .lean()
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id).select('-password').lean()
  }

  async getSafeUser(id) {
    return await User.findById(id)
      .select('-password')
      .lean()
  }
}

export default new UserDBService()