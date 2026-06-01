import Product from '../models/Product.js';

export const getAllProducts = () => Product.find();

export const getProductById = (id) => Product.findById(id).lean();

export const createProduct = (data) => Product.create(data);

export const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });

export const deleteProduct = (id) =>
  Product.findByIdAndDelete(id);

// СУТЬ Controller → Service → Model → MongoDB