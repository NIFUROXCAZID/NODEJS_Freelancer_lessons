export function productValidationMiddleware(validationSchema, viewName) {
  // viewName параметр щоб 1 форму для create + update
  return (req, res, next) => {

    const result = validationSchema.safeParse(req.body)

    if (!result.success) {
      return res.render(viewName, {
        product: req.body,
        errors: result.error.issues.map(
          err => err.message
        ),
      })
    }

    req.validatedData = result.data

    next()
  }
}
