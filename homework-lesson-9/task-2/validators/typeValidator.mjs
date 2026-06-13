import { z } from 'zod'

class TypeValidator {
  static typeSchema = z.object({
    title: z.string().min(1, 'Назва обовʼязкова'),
    // Додайте інші поля, якщо потрібно
  })

  static validate(req, res, next) {
    const result = TypeValidator.typeSchema.safeParse(req.body)
    if (!result.success) {
      req.validationErrors = result.error.errors.map((e) => ({
        msg: e.message,
        path: e.path,
      }))
    } else {
      req.body = result.data
    }
    next()
  }
}

export default TypeValidator
