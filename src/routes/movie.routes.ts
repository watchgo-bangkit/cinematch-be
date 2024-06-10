import { Router } from 'express'
import * as movieServices from '../services/movie.services'
import validateSchema from '../middlewares/validateSchema'
import { MovieDetailSchema, MovieSwipeSchema } from '../dto/movies.dto'
const router = Router()

router.get('/', movieServices.getMovieList)
router.get(
  '/:id',
  validateSchema(MovieDetailSchema),
  movieServices.getMovieDetail,
)
router.post(
  '/:id',
  validateSchema(MovieSwipeSchema),
  movieServices.handleSwipeMovie,
)

router.get('/genre', movieServices.getGenreList)

export default router
