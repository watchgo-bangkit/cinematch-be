import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL
const TMDB_API_KEY = process.env.TMDB_API_KEY

const TMDB_API_PATH = {
  movieGenreList: '/genre/movie/list',
  tvGenreList: '/genre/tv/list',
}

const fetchGenres = async (path: string) => {
  const response = await axios.get(
    `${TMDB_API_BASE_URL}${path}?api_key=${TMDB_API_KEY}`,
  )
  return response.data.genres
}

const populateGenres = async () => {
  try {
    const movieGenres = await fetchGenres(TMDB_API_PATH.movieGenreList)
    const tvGenres = await fetchGenres(TMDB_API_PATH.tvGenreList)

    const allGenres = [...movieGenres, ...tvGenres]
    const uniqueGenres = allGenres.filter(
      (genre, index, self) =>
        index === self.findIndex((g) => g.id === genre.id),
    )

    for (const genre of uniqueGenres) {
      await prisma.genre.upsert({
        where: { tmdb_id: genre.id },
        update: {},
        create: {
          tmdb_id: genre.id,
          name: genre.name,
        },
      })
    }

    console.log('Genres populated successfully.')
  } catch (error) {
    console.error('Error populating genres:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateGenres()
