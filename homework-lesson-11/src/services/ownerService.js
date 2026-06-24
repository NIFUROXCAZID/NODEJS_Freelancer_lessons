import Owner from '../models/Owner.js'

export const getAllOwners = async () => {
  return await Owner.find().lean()
}

export const getOwnerById = async (id) => {
  return await Owner.findById(id)
}

export const createOwner = async (ownerData) => {
  const owner = new Owner(ownerData)
  return await owner.save()
}

export const updateOwner = async (id, ownerData) => {
  return await Owner.findByIdAndUpdate(id, ownerData, {
    new: true,
    runValidators: true,
  })
}

export const deleteOwner = async (id) => {
  return await Owner.findByIdAndDelete(id)
}