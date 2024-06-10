import axios from 'axios'
import dotenv from 'dotenv'
import {
  TMDB_Cast,
  TMDB_Crew,
  TMDB_Movie,
  TMDB_MovieDetail,
} from '../types/tmdb.types'

dotenv.config()

const TMDB_API_PATH = {
  movieList: '/movie/now_playing',
  movieDetail: (movie_id: number) => `/movie/${movie_id}`,
  movieGenreList: '/genre/movie/list',
  tvGenreList: '/genre/tv/list',
  creditsDetail: (movie_id: number) => `/movie/${movie_id}/credits`,
}

const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL
const TMDB_API_KEY = process.env.TMDB_API_KEY

const tmdbAxios = axios.create({
  baseURL: TMDB_API_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
})

// Function to fetch all genres
export const getTMDBAllGenres = async () => {
  try {
    const movieGenresResponse = await tmdbAxios.get(
      TMDB_API_PATH.movieGenreList,
    )
    const tvGenresResponse = await tmdbAxios.get(TMDB_API_PATH.tvGenreList)

    return {
      genres: [
        ...movieGenresResponse.data.genres,
        ...tvGenresResponse.data.genres,
      ],
    }
  } catch (error) {
    throw new Error('Failed to fetch genres')
  }
}

// Function to fetch the movie list
export const getTMDBMovieList = async () => {
  try {
    const movieListResponse = await tmdbAxios.get(TMDB_API_PATH.movieList)

    return {
      movies: movieListResponse.data.results as TMDB_Movie[],
    }
  } catch (error) {
    throw new Error('Failed to fetch movie list')
  }
}

export const getTMDBMovieDetail = async (movie_id: number) => {
  try {
    const movieDetailResponse = await tmdbAxios.get(
      TMDB_API_PATH.movieDetail(movie_id),
    )
    return {
      movie: movieDetailResponse.data as TMDB_MovieDetail,
    }
  } catch (error) {
    throw new Error(`Failed to fetch movie detail with id ${movie_id}`)
  }
}

export const getTMDBMovieCreditsDetail = async (movie_id: number) => {
  try {
    const movieCreditsResponse = await tmdbAxios.get(
      TMDB_API_PATH.creditsDetail(movie_id),
    )
    const { id, cast, crew } = movieCreditsResponse.data
    const filteredCast: TMDB_Cast[] = cast
      ?.map(
        ({
          id,
          adult,
          gender,
          name,
          popularity,
          profile_path,
          character,
        }: any) => ({
          id,
          adult,
          gender,
          name,
          popularity,
          profile_path,
          character,
        }),
      )
      ?.sort((a: TMDB_Cast, b: TMDB_Cast) => a.popularity - b.popularity)

    const director = (crew as TMDB_Crew[])?.find(
      ({ job, department }) => job == 'Director' || department == 'Directing',
    )
    return {
      credits: {
        id,
        cast: filteredCast,
        director: director ?? null,
      },
    }
  } catch (error) {
    throw new Error('Failed to fetch movie list')
  }
}
