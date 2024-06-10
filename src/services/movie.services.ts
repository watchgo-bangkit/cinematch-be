import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import {
  getTMDBMovieCreditsDetail,
  getTMDBMovieDetail,
  getTMDBMovieList,
} from './tmdb.services'
import { MovieDetailParams } from '../dto/movies.dto'
import { TMDB_MovieDetail } from '../types/tmdb.types'

const prisma = new PrismaClient()

export const getMovieList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movies = await getTMDBMovieList()

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
    const dataMovie = await getTMDBMovieDetail(parsedId)
    const {
      adult,
      backdrop_path,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      title,
      video,
      vote_average,
      vote_count,
      genres,
      homepage,
      imdb_id,
      runtime,
      status,
      tagline,
    } = dataMovie.movie

    const dataCredits = await getTMDBMovieCreditsDetail(parseInt(id))

    const movieDetail: TMDB_MovieDetail = {
      id: parsedId,
      adult,
      backdrop_path,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      title,
      video,
      vote_average,
      vote_count,
      genres,
      homepage,
      imdb_id,
      runtime,
      status,
      tagline,
      cast: dataCredits.credits.cast,
    }

    return res.json({ data: movieDetail })
  } catch (error) {
    next(error)
  }
}

export const handleSwipeMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {}

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
