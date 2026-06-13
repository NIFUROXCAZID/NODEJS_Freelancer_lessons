import { z } from 'zod'
import fs from 'fs'

class UserValidator {
  static userSchema = z.object({
    // Email: обов'язковий, валідний email, нормалізація
    email: z
      .string()
      .email('Invalid email address')
      .min(5, 'Email is required')
      .max(100, 'Email too long')
      .transform((val) => val.trim().toLowerCase()),

    // Password: мінімум 6, максимум 16, хоча б 1 літера, 1 цифра, 1 спецсимвол
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(16, 'Password must be at most 16 characters long')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one letter, one number, and one special character',
      ),

    // Age: ціле число, 18-120
    age: z.preprocess(
      (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
      z
        .number()
        .int('Age must be an integer')
        .min(18, 'Age must be between 18 and 120')
        .max(120, 'Age must be between 18 and 120'),
    ),

    // Name: обов'язковий, мінімум 3 символи, максимум 50, без пробілів на початку/кінці
    name: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(50, 'Username must be at most 50 characters long')
      .nonempty('Name is required')
      .trim(),

    // Type: обов'язковий, ObjectId як string (24 символи)
    type: z
      .string()
      .length(24, 'User type is required and must be a valid ObjectId'),
    // img: опціонально, додається у контролері якщо є файл
  })

  static validate(req, res, next) {
    const result = UserValidator.userSchema.safeParse(req.body)
    if (!result.success) {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path)
      }
      req.validationErrors = result.error.issues.map((err) => err.message)
    } else {
      req.body = result.data
    }
    next()
  }
}

export default UserValidator
