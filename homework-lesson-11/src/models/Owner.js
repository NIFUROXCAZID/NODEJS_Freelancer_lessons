import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ім’я обов’язкове'],
      trim: true,
      minlength: [2, 'Мінімум 2 символи'],
      maxlength: [100, 'Максимум 100 символів'],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Максимум 100 символів'],
    },
  }
);

export default mongoose.model('Owner', ownerSchema, 'owner');