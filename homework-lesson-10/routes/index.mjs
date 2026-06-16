import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'ДЗ №10 Додавання автентифікації' })
})
router.get('/about', (req, res) => {
  res.render('about', { title: 'Додаток для автопарку' })
})

export default router