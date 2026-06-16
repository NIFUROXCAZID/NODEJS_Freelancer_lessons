import Brand from '../models/Brand.js'

export const getAllBrands = async () => {
  return await Brand.find().lean()
}

export const getBrandById = async (id) => {
  return await Brand.findById(id)
}

export const createBrand = async (brandData) => {
  const brand = new Brand(brandData)
  return await brand.save()
}

export const updateBrand = async (id, brandData) => {
  return await Brand.findByIdAndUpdate(id, brandData, {
    new: true,
    runValidators: true,
  })
}

export const deleteBrand = async (id) => {
  return await Brand.findByIdAndDelete(id)
}