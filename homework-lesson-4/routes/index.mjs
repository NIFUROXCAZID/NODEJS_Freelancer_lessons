import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' })
})
router.get('/about', (req, res) => {
  res.render('about', { title: 'Наша програма' })
})

export default router
