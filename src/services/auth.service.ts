import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import HttpError from '../utils/httpError'
import { LoginDataBody, RegisterDataBody } from '../dto/auth.dto'
import { NextFunction, Request, Response } from 'express'

const prisma = new PrismaClient()

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body as RegisterDataBody

    const validatedGenrePreferences = RegisterDataBody.pick({
      genre_preferences: true,
    }).parse(req.body)

    // Validate genre IDs
    for (const genreId of validatedGenrePreferences.genre_preferences) {
      const genre = await prisma.genre.findUnique({ where: { id: genreId } })
      if (!genre) {
        return res.status(400).json({ error: `Invalid genre ID: ${genreId}` })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
        genre_preferences: {
          connect: validatedGenrePreferences.genre_preferences.map(
            (genreId) => ({ id: genreId }),
          ),
        },
      },
      include: {
        genre_preferences: true,
      },
    })
    return res.status(201).json({ data: newUser })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as unknown as LoginDataBody

    const user = await prisma.user.findUnique({ where: { email: email } })

    if (!user) {
      throw new HttpError(401, 'User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid credentials')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'secretKey',
    )

    return res.status(200).json({ data: { user, token } })
  } catch (error) {
    next(error)
  }
}
