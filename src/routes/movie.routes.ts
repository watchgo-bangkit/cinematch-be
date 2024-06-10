import { Router } from 'express'
import * as movieServices from '../services/movie.services'
import validateSchema from '../middlewares/validateSchema'
import { MovieDetailSchema, MovieSwipeSchema } from '../dto/movies.dto'
const router = Router()

router.get('/genres', movieServices.getGenreList)
router.get('/', movieServices.getMovieList)
router.get(
  '/:id',
  validateSchema(MovieDetailSchema),
  movieServices.getMovieDetail,
)
router.post(
  '/:id/swipe',
  validateSchema(MovieSwipeSchema),
  movieServices.handleSwipeMovie,
)

export default router
