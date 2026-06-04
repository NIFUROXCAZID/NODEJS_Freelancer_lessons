export function buildProductFormState({ dbProduct, body, id }) {
  return {
    ...dbProduct,
    ...body,
    id: dbProduct?.id ?? id ?? null,
  };
}