import { z } from 'zod'

export const postSchema = z.object({
  post: z.string().min(1, 'Пост обовʼязковий'),
  authors: z
    .array(z.string().min(1))
    .min(1, 'Потрібно вибрати хоча б одного автора'),
  img: z.string().optional(),
})

export function validatePost(req, res, next) {
  let data = req.body

  // Якщо authors передано як рядок (один автор), привести до масиву
  if (typeof data.authors === 'string') {
    data.authors = [data.authors]
  }
  if (req.file?.filename) {
    data.img = req.file.filename
  }
  const result = postSchema.safeParse(data)
  if (!result.success) {
    req.validationErrors = result.error.issues.map((err) => err.message)
  } else {
    req.body = result.data // нормалізовані дані
  }
  next()
}
