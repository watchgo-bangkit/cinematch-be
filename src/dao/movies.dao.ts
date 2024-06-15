import { SwipeDirection } from '../dto/movies.dto'
import {
  getTMDBMovieCreditsDetail,
  getTMDBMovieDetail,
} from '../services/tmdb.services'
import { TMDB_MovieDetail } from '../types/tmdb.types'

export const getMovieById = async (id: number) => {
  const dataMovie = await getTMDBMovieDetail(id)

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

  const dataCredits = await getTMDBMovieCreditsDetail(id)

  const movieDetail: TMDB_MovieDetail = {
    id,
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
    credits: dataCredits.credits,
  }
  return movieDetail
}

export const insertMovieToWatchlist = async (
  id: number,
  swipe_direction: SwipeDirection,
) => {
    const movieDetail = await getMovieById(id)
    const {
        release_date,
        runtime,
        vote_average,
        credits: { cast, director },
        genres,
    } = movieDetail
    // TODO: insert datanya ke movie watchlist sesuai yg kepake di model
}
