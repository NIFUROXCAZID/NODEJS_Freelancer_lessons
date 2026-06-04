import Product from '../models/Product.js';
import Owner from '../models/Owner.js';
import Brand from '../models/Brand.js';


// export const getAllProducts = () => Product.find();
export const getAllProducts = () => Product.find().populate('brand').populate('owner').lean();

// export const getProductById = (id) => Product.findById(id).lean();

export const getProductByIdForRead = async (id) =>
  Product.findById(id).populate({
      path: 'brand',
      select: 'name -_id',
    }).populate({
      path: 'owner',
      select: 'name location -_id',
    }).lean();

export const getProductById = (id) => Product.findById(id).lean();

export const createProduct = (data) => Product.create(data);

export const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

export const deleteProduct = (id) =>
  Product.findByIdAndDelete(id);

// СУТЬ Controller → Service → Model → MongoDB