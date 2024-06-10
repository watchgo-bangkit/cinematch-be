import bcrypt from 'bcryptjs'

import { Genre, PrismaClient } from '@prisma/client'
import { ZodError } from 'zod'
import HttpError from '../utils/httpError'
const prisma = new PrismaClient()

export const getMovieList = async (data: any) => {
  try {
  } catch (error) {}
}
export const getGenreList = async (): Promise<Genre[]> => {
  try {
    const genres = await prisma.genre.findMany()
    return genres
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, 'Validation Error: ' + error.message)
    }
    throw new HttpError(500, 'Internal Server Error')
  }
}
