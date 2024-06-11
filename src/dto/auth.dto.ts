import { z } from 'zod'
import { Gender } from '@prisma/client'

export const RegisterDataBody = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  age: z.number().min(0),
  gender: z.nativeEnum(Gender),
  genre_preferences: z.array(z.number()),
})
export const RegisterDataSchema = z.object({
  body: RegisterDataBody,
})
export const LoginDataBody = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})
export const LoginDataSchema = z.object({
  body: LoginDataBody,
})

export type RegisterDataBody = z.infer<typeof RegisterDataBody>
export type LoginDataBody = z.infer<typeof LoginDataBody>
