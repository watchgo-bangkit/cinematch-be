import { getMovieById } from './movies.dao'

export const getRecommendationsMovieDetail = async (
  movieId: number
) => {
  const movieDetail = await getMovieById(movieId)
  return movieDetail
}