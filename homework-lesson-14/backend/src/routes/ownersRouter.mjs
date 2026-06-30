import { Router } from 'express'
import { getAllOwners } from '../services/ownerSqlService.mjs'
import { requireAuth } from '../middleware/auth.middleware.mjs'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  const owners = await getAllOwners()
  res.json(owners)
})

export default router