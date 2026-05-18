import { Router } from 'express'

const router = Router()

let products = [
  { name: 'Phone', price: 500 },
  { name: 'Laptop', price: 1200 }
]

// список продуктів
router.get('/', (req, res) => {
  res.render('products', { products })
})

// сторінка додавання
router.get('/add', (req, res) => {
  res.render('add')
})

// додати продукт
router.post('/add', (req, res) => {
  const { name, price } = req.body
  products.push({ name, price })
  res.redirect('/products')
})

export default router