// shared/constants/routes.js

export const ROUTES = Object.freeze({
  HOME: '/',
  ABOUT: '/about',

  LOGIN: '/login',
  REGISTER: '/register',

  PRODUCTS: '/products',
  PRODUCTS_INFINITE: '/products-infinite',

  PRODUCT_CREATE: '/products/create',

  PRODUCT_DETAILS: '/products/:id',
  PRODUCT_EDIT: '/products/:id/edit',

  CART: '/cart',

  buildProductDetails: (id) => `/products/${id}`,
  buildProductEdit: (id) => `/products/${id}/edit`,
})