export function productValidationMiddleware(validationSchema) {
  return (req, res, next) => {
    const result = validationSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      })
    }

    req.validatedData = result.data
    next()
  }
}
