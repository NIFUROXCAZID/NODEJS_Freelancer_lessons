import { createBrowserRouter } from 'react-router-dom'
import { ROLES } from '../shared/constants/roles'
import { ROUTES } from '../shared/constants/routes'

import Layout from '../shared/components/Layout'

import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProductsPage from '../pages/ProductsPage'
import ProductsInfinitePage from '../pages/ProductsInfinitePage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import ProductCreatePage from '../pages/ProductCreatePage'
import ProductEditPage from '../pages/ProductEditPage'
import CartPage from '../pages/CartPage'

import ProtectedRoute from '../shared/components/ProtectedRoute'
import RoleRoute from '../shared/components/RoleRoute'



export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },

      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },

      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },

      {
        element: <ProtectedRoute />,

        children: [
          {
            path: ROUTES.PRODUCTS,
            element: <ProductsPage />,
          },
          {
            path: ROUTES.PRODUCTS_INFINITE,
            element: <ProductsInfinitePage />,
          },
          {
            path: ROUTES.PRODUCT_DETAILS,
            element: <ProductDetailsPage />,
          },
          {
            path: ROUTES.CART,
            element: <CartPage />,
          },
        ],
      },

      {
        element: (
          <RoleRoute
            roles={[ROLES.MANAGER, ROLES.ADMIN]}
          />
        ),

        children: [
          {
            path: ROUTES.PRODUCT_CREATE,
            element: <ProductCreatePage />,
          },

          {
            path: ROUTES.PRODUCT_EDIT,
            element: <ProductEditPage />,
          },
        ],
      },


    ],
  },
])