import HttpError from '../utils/httpError'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
