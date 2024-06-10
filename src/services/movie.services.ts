import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

import { getMovieCreditsDetail } from './tmdb.services'
const prisma = new PrismaClient()

export const getMovieList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    next(error)
  }
}
export const getGenreList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genres = await prisma.genre.findMany()
    res.json({ data: genres })
  } catch (error) {
    next(error)
  }
}
