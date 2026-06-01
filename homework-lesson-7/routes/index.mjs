import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'ДЗ №7 Перехід на локальну Mongoose БД' })
})
router.get('/about', (req, res) => {
  res.render('about', { title: 'Додаток для автопарку' })
})

export default router