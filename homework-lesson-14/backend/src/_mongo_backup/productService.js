import Product from '../models/Product.js'
import Brand from '../models/Brand.js'
import Owner from '../models/Owner.js'

export const getAllProducts = async (
  filter = {},
  sort = {},
  pagination = {},
) => {
  const page = Number(pagination.page) || 1
  const limit = Number(pagination.limit) || 5
  const skip = (page - 1) * limit

  const [items, totalItems] = await Promise.all([
    Product.find(filter)
      .populate('brand')
      .populate('owner')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter),
  ])

  const totalPages = Math.ceil(totalItems / limit)

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  }
}

export const getProductById = (id) => Product.findById(id).populate('brand').populate('owner').lean()

export const createProduct = (data) => Product.create(data)

export const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean()

export const deleteProduct = (id) => Product.findByIdAndDelete(id).lean()