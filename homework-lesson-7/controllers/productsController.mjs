// import Product from '../models/productModels.mjs'
// Тепер у тебе:

// Було(JSON)	Стало(MongoDB)
// loadProductById	Product.findById
// addNewProduct	Product.create
// updateProduct	findByIdAndUpdate
// deleteProductById	findByIdAndDelete

// СУТЬ 🧠 Простими словами
// 👉 Controller тепер:
// бере запит
// викликає Product.find() / create() / update()
// повертає результат

import { deleteFileFromDir } from '../utils/utils.js';
import { buildProductFormState } from '../services/productFormBuilder.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService.js';

class ProductsController {

  static async getAllProducts(req, res) {
    try {
      const products = await getAllProducts();
      res.render('products/productsList', {
        title: 'Список товарів',
        products,
      });

    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка завантаження даних',
        error,
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await getProductById(id);
      if (!product) {
        return res.status(404).render('error', {
          message: 'Товар не знайдено',
        });
      }
      res.render('products/productDetail', {
        title: 'Інформація про товар',
        product,
      });

    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка завантаження товару',
        error,
      });
    }
  }

  static async getProductForm(req, res) {
    try {
      let productFromDb = {};

      if (req.params.id) {
        productFromDb = await getProductById(req.params.id);
      }

      res.render('products/productForm', {
        product: buildProductFormState({
          dbProduct: productFromDb,
          body: {},
          id: req.params.id,
        }),
        errors: [],
      });

    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка завантаження форми',
        error,
      });
    }
  }

  static async createProduct(req, res) {
    try {
      const productData = req.body;

      if (req.file) {
        productData.photo = '/uploads/' + req.file.filename;
      }

      await createProduct(productData);

      res.redirect('/products');

    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при збереженні товару',
        error,
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;

      const productFromDb = await getProductById(id);

      if (!productFromDb) {
        return res.status(404).render('error', {
          message: 'Товар не знайдено',
        });
      }

      const productData = {
        ...req.validatedData,
        photo: productFromDb.photo,
      };

      if (req.file) {
        deleteFileFromDir('uploads', product.photo);
        productData.photo = '/uploads/' + req.file.filename;
      }

      await updateProduct(id, productData);

      res.redirect('/products');

    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при оновленні товару',
        error,
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.body;

      const product = await getProductById(id);

      if (!product) {
        return res.status(404).end();
      }

      if (product.photo) {
        deleteFileFromDir('uploads', product.photo);
      }

      await deleteProduct(id);

      res.status(204).end();

    } catch (error) {
      res.status(500).render('error', {
        message: 'Помилка при видаленні товару',
        error,
      });
    }
  }
}

export default ProductsController;