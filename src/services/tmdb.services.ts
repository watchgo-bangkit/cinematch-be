import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const TMDB_API_PATH = {
  movieList: '/movie/now_playing',
  movieGenreList: '/genre/movie/list',
  tvGenreList: '/genre/tv/list',
  creditsDetail: (movie_id: number) => `movie/${movie_id}/credits`,
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
export const getAllGenres = async () => {
  try {
    const movieGenresResponse = await tmdbAxios.get(
      TMDB_API_PATH.movieGenreList,
    )
    const tvGenresResponse = await tmdbAxios.get(TMDB_API_PATH.tvGenreList)

    return {
      genre_list: [
        ...movieGenresResponse.data.genres,
        ...tvGenresResponse.data.genres,
      ],
    }
  } catch (error) {
    console.error('Error fetching genres:', error)
    throw new Error('Failed to fetch genres')
  }
}

// Function to fetch the movie list
export const getMovieList = async () => {
  try {
    const movieListResponse = await tmdbAxios.get(TMDB_API_PATH.movieList)

    return {
      movieList: movieListResponse.data.results,
    }
  } catch (error) {
    console.error('Error fetching movie list:', error)
    throw new Error('Failed to fetch movie list')
  }
}

// Function to fetch the movie credits
export const getMovieCreditsDetail = async (movie_id: number) => {
  try {
    const movieListResponse = await tmdbAxios.get(
      TMDB_API_PATH.creditsDetail(movie_id),
    )

    return {
      movieList: movieListResponse.data.results,
    }
  } catch (error) {
    console.error('Error fetching movie list:', error)
    throw new Error('Failed to fetch movie list')
  }
}
