import HttpError from '../utils/httpError'
import { PrismaClient } from '@prisma/client'
import { getMovieById } from './movies.dao'

const prisma = new PrismaClient()

export const getWatchlistMovieDetail = async (
  movieId: number
) => {
  const movieDetail = await getMovieById(movieId)
  return movieDetail
}

export const getWatchlistByIdAndUserId = async (
  watchlistId: number,
  userId?: number,
) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: {
      id: watchlistId,
      user_id: userId,
    },
  })

  if (!watchlist) {
    throw new HttpError(404, 'Watchlist not found')
  }
  return watchlist
}
