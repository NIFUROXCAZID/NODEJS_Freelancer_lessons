import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Назва бренду обов’язкова'],
      trim: true,
      minlength: [2, 'Мінімум 2 символи'],
      maxlength: [50, 'Максимум 50 символів'],
    },
  }
);

export default mongoose.model('Brand', brandSchema, 'brand');
// 2. Назва колекції в MongoDB (автоматично)
// 👉 він бере model name і:
// переводить у lowercase
// робить plural(додає s)

// Brand → brands
// Owner → owners
// Product → products

// ОЙ Я ТАК НАМУЧИВСЯ