import { Router } from 'express'
import * as movieServices from '../services/movie.services'
const router = Router()

router.get('/genre', movieServices.getGenreList)

export default router
