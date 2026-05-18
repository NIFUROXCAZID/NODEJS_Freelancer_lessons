import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('index')
})

// about (static HTML)
router.get('/about', (req, res) => {
  res.sendFile(process.cwd() + '/public/about.html')
})

export default router