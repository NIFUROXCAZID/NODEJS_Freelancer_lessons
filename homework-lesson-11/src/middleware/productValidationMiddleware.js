import { buildProductFormState } from '../services/productFormBuilder.js';
import { getProductById } from '../services/productService.js';

export function productValidationMiddleware(validationSchema, viewName) {
  return async (req, res, next) => {
    const result = validationSchema.safeParse(req.body);

    if (!result.success) {
      const productFromDb = req.params.id
        ? await getProductById(req.params.id)
        : {};

      return res.render(viewName, {
        product: buildProductFormState({
          dbProduct: productFromDb,
          body: req.body,
          id: req.params.id,
        }),
        errors: result.error.issues.map(err => err.message),
      });
    }

    req.validatedData = result.data;
    next();
  };
}
