import { Router, Request, Response, NextFunction } from 'express'
import * as movieServices from '../services/movie.services'
const router = Router()

router.get(
  '/genre',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await movieServices.getGenreList()
      res.json({ data: genres })
    } catch (error) {
      next(error)
    }
  },
)

export default router
