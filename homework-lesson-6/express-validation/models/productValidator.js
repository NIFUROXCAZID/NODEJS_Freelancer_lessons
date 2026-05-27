import { checkSchema } from 'express-validator'

class ProductValidator {
  static productValidationSchema = checkSchema({
    title: {
      notEmpty: {
        errorMessage: 'Назва обовʼязкова!',
      },
      isLength: {
        options: { min: 2 },
        errorMessage: 'Назва має бути мінімум 2 символи',
      },
      trim: true,
      escape: true,
    },
    year: {
      notEmpty: {
        errorMessage: 'Рік обовʼязковий!',
      },
      isNumeric: {
        errorMessage: 'Рік має бути числом',
      },
    },
    number: {
      notEmpty: {
        errorMessage: 'Номер обовʼязковий!',
      },
      isLength: {
        options: { min: 4 },
        errorMessage: 'Номер має бути мінімум 4 символи',
      },
    },
    photo: {
      custom: {
        options: (value, { req }) => {
          if (!req.file) return true
          const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
          ]
          if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error('Фото повинно бути JPG, PNG або WEBP')
          }
          return true
        },
      },
    },
  })
}

export default ProductValidator
