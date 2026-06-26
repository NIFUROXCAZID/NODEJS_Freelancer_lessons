import z from 'zod'

export const ProductValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty({
      message: 'Вкажіть назву або марку автомобіля',
    })
    .min(2, {
      message: 'Назва автомобіля повинна містити мінімум 2 символи',
    })
    .max(50, {
      message: 'Назва автомобіля занадто довга',
    })
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9\s\-]+$/, {
      message:
        'Назва може містити лише літери, цифри, пробіли та дефіс',
    }),

  year: z
    .string()
    .nonempty({
      message: 'Вкажіть рік випуску автомобіля',
    })
    .regex(/^\d{4}$/, {
      message: 'Рік має складатися з 4 цифр',
    })
    .refine((value) => {
      const year = Number(value)
      const currentYear = new Date().getFullYear()

      return year >= 1886 && year <= currentYear + 1
    }, {
      message:
        'Вкажіть коректний рік випуску автомобіля',
    }),

  number: z
    .string()
    .trim()
    .nonempty({
      message: 'Вкажіть номер автомобіля',
    })
    .min(4, {
      message: 'Номер автомобіля занадто короткий',
    })
    .max(12, {
      message: 'Номер автомобіля занадто довгий',
    })
    .regex(/^[A-ZА-ЯІЇЄ0-9\s-]+$/i, {
      message:
        'Номер може містити лише літери, цифри, пробіли та дефіс',
    }),
  
  price: z.coerce
    .number()
    .min(0, {
      message: 'Ціна не може бути меншою за 0',
    }),
  
  brand: z.string().nonempty({
    message: 'Оберіть марку автомобіля',
  }),

  owner: z.string().nonempty({
    message: 'Оберіть власника',
  }),

  photo: z
    .string()
    .optional()
    .refine((value) => {
      // якщо фото необов’язкове
      if (!value) return true

      return /\.(jpg|jpeg|png|webp)$/i.test(value)
    }, {
      message:
        'Фото повинно бути у форматі JPG, PNG або WEBP',
    }),
})