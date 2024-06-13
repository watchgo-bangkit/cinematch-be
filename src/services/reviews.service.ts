import { Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { ReviewWatchlistParams } from '../dto/reviews.dto'
import * as WatchlistDao from '../dao/watchlist.dao'
import { AuthRequest } from '../middlewares/auth'

const prisma = new PrismaClient()

export const addReviewToWatchlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId
    const { watchlist_id } = req.params as ReviewWatchlistParams
    const watchlistId = parseInt(watchlist_id)
    const watchlist = await WatchlistDao.getWatchlistByIdAndUserId(
      watchlistId,
      userId,
    )

    const newReview = await prisma.review.create({
      data: {
        ...req.body,
        movie_id: watchlist?.movie_id,
        user_id: userId,
        watchlist_id: watchlistId,
      },
    })

    return res.status(201).json({ data: newReview })
  } catch (error) {
    next(error)
  }
}
export const getReviewByWatchlistId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { watchlist_id } = req.params as ReviewWatchlistParams

    const watchlist = await WatchlistDao.getWatchlistByIdAndUserId(
      parseInt(watchlist_id),
    )
    const { movie_id } = watchlist
    const reviews = await prisma.review.findMany({
      where: {
        movie_id: movie_id,
      },
      include: {
        user: {
          select: {
            name: true,
            gender: true,
            age: true,
          },
        },
      },
    })
    return res.status(200).json({ data: reviews })
  } catch (error) {
    next(error)
  }
}

export const getAllMyReviews = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId

    const reviews = await prisma.review.findMany({
      where: {
        user_id: userId,
      },
    })
    return res.status(200).json({ data: reviews })
  } catch (error) {
    next(error)
  }
}
