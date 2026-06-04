import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Назва товару обов’язкова'],
    minlength: [2, 'Мінімум 2 символи'],
    trim: true,
  },

  year: {
    type: String,
    required: [true, 'Рік обов’язковий'],
    match: [/^\d{4}$/, 'Рік має бути у форматі YYYY'],
  },

  number: {
    type: String,
    required: [true, 'Номер обов’язковий'],
    uppercase: true,
    trim: true,
  },

  photo: {
    type: String,
    default: '/public/images/photo-not-available.jpg',
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

// Створює модель з методами автомкатично Product.create() Product.find() Product.findById() Product.findByIdAndUpdate() Product.deleteOne()
