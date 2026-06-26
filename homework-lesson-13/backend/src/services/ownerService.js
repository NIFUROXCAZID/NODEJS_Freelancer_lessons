import Owner from '../models/Owner.js'
// Сервіс — це прокладка між controller і model, не між router і controller.
// Route → Controller → Service → Model → MongoDB
export const getAllOwners = async () => {
  return await Owner.find().lean()
}

export const getOwnerById = async (id) => {
  return await Owner.findById(id).lean()
}

export const createOwner = async (ownerData) => {
  return await Owner.create(ownerData)
}

export const updateOwner = async (id, ownerData) => {
  return await Owner.findByIdAndUpdate(id, ownerData, {
    new: true,
    runValidators: true,
  }).lean()
}

export const deleteOwner = async (id) => {
  return await Owner.findByIdAndDelete(id).lean()
}