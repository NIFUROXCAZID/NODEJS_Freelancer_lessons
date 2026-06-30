import { Router } from 'express'
import { getAllBrands } from '../services/brandSqlService.mjs'
import { requireAuth } from '../middleware/auth.middleware.mjs'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const brands = await getAllBrands()
  res.json(brands)
})

export default router