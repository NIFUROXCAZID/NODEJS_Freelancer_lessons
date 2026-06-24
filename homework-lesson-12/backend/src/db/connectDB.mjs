import mongoose from 'mongoose'
import config from '../config/default.mjs'

export default async function connectDB() {
  try {
    await mongoose.connect(config.mongoURI)

    console.log('Успішно підключено до MongoDB')
  } catch (err) {
    console.error('Помилка підключення до MongoDB:', err)
    process.exit(1)
  }
}

// СУТЬ 👉 цей файл = “тест + підключення” Він: пробує підключитись якщо ок → сервер працює якщо ні → показує причину