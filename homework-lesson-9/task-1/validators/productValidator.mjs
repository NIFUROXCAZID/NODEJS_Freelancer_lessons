import { z } from 'zod'
import fs from 'fs'

class ProductValidator {
  static productSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Product name must be at least 2 characters long')
      .max(100, 'Product name must be at most 100 characters long'),

    price: z.preprocess(
      (val) => Number(val),
      z.number().positive('Price must be greater than 0'),
    ),

    quantity: z.preprocess(
      (val) => Number(val),
      z.number().int('Quantity must be an integer').min(0),
    ),

    // img буде додаватись окремо через multer при необхідності
  })

  static validateProduct(req, res, next) {
    const result = ProductValidator.productSchema.safeParse(req.body)

    if (!result.success) {
      // Якщо колись додаси завантаження фото
      if (req.file?.path) {
        fs.unlinkSync(req.file.path)
      }

      req.validationErrors = result.error.issues.map(
        (err) => err.message,
      )
    } else {
      req.body = result.data
    }

    next()
  }
}

export default ProductValidator
