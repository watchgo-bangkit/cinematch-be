import { Router } from 'express'
import * as reviewWatchlist from '../services/reviews.service'
import validateSchema from '../middlewares/validateSchema'
import { AddReviewSchema, getAllReviewSchema } from '../dto/reviews.dto'
import authenticateToken from '../middlewares/auth'

const router = Router()

router.post(
  '/:watchlist_id',
  authenticateToken,
  validateSchema(AddReviewSchema),
  reviewWatchlist.addReviewToWatchlist,
)

router.get(
  '/:watchlist_id',
  authenticateToken,
  validateSchema(getAllReviewSchema),
reviewWatchlist.getReviewByWatchlistId,
)

router.get('/me', authenticateToken, reviewWatchlist.getAllMyReviews)

export default router
