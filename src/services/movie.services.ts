import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { getTMDBMovieList } from './tmdb.services'
import {
  MovieDetailParams,
  MovieListQuery,
  MovieSwipeBody,
  SwipeDirection,
} from '../dto/movies.dto'
import { getMovieById, insertMovieToWatchlist } from '../dao/movies.dao'

const prisma = new PrismaClient()

export const getMovieList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { popular, page } = req.query as MovieListQuery
    const movies = await getTMDBMovieList(page, popular)

    return res.json({ data: movies })
  } catch (error) {
    next(error)
  }
}

export const getMovieDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as MovieDetailParams
    const parsedId = parseInt(id)
    const movieDetail = await getMovieById(parsedId)

    return res.json({ data: movieDetail })
  } catch (error) {
    next(error)
  }
}

export const handleSwipeMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as MovieDetailParams
    const { swipe_direction } = req.body as MovieSwipeBody

    insertMovieToWatchlist(parseInt(id), swipe_direction as SwipeDirection)
    // TODO: return inserted watchlist?
    return res.json({})
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
