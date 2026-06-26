import Brand from '../models/Brand.js'

// Сервіс — це прокладка між controller і model, не між router і controller.
// Route → Controller → Service → Model → MongoDB

export const getAllBrands = async () => {
  return await Brand.find().lean()
}

export const getBrandById = async (id) => {
  return await Brand.findById(id).lean()
}

export const createBrand = async (brandData) => {
  return await Brand.create(brandData)
}

export const updateBrand = async (id, brandData) => {
  return await Brand.findByIdAndUpdate(id, brandData, {
    new: true,
    runValidators: true,
  }).lean()
}

export const deleteBrand = async (id) => {
  return await Brand.findByIdAndDelete(id).lean()
}