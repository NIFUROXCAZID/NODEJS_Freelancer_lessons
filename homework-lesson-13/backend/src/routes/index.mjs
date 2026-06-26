import { Router } from 'express'

const router = Router()

// один простий endpoint: для перевірки стану API (GET /api/products приклад ендпоінта запамьятай)
router.get('/', (req, res) => {
  res.json({
    message: 'Fleet API is running'
  })
})

export default router