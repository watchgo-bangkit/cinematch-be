import { z } from 'zod'
import { Gender } from '@prisma/client'

export const RegisterDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  age: z.number().min(0),
  gender: z.nativeEnum(Gender),
  preferences: z.array(z.string()),
})
export const LoginDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

export type RegisterData = z.infer<typeof RegisterDataSchema>
export type LoginData = z.infer<typeof LoginDataSchema>
