import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import { ZodError } from 'zod'
import HttpError from '../utils/httpError'
import { LoginData, RegisterData } from '../dto/auth.dto'

const prisma = new PrismaClient()

export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, 'Validation Error: ' + error.message)
    }
    throw new HttpError(500, 'Internal Server Error')
  }
}

export const loginUser = async (
  data: LoginData,
): Promise<{ user: User; token: string }> => {
  const { email, password } = data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new HttpError(401, 'User not found')
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) throw new HttpError(401, 'Invalid credentials')
  const token = jwt.sign({ userId: user.id, email: user.email }, 'secretKey', {
    expiresIn: '1h',
  })
  return { user, token }
}
