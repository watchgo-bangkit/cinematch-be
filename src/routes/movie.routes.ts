import { Router } from 'express'
import * as movieServices from '../services/movie.services'
import validateSchema from '../middlewares/validateSchema'
import {
  MovieDetailSchema,
  MovieListSchema,
  MovieSwipeSchema,
} from '../dto/movies.dto'
import authenticateToken from '../middlewares/auth'
const router = Router()

router.get('/genres', movieServices.getGenreList)
router.get(
  '/',
  authenticateToken,
  validateSchema(MovieListSchema),
  movieServices.getMovieList,
)
router.get(
  '/:id',
  authenticateToken,
  validateSchema(MovieDetailSchema),
  movieServices.getMovieDetail,
)
router.post(
  '/:id/swipe',
  authenticateToken,
  validateSchema(MovieSwipeSchema),
  movieServices.handleSwipeMovie,
)

export default router
