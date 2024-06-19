import { z } from 'zod'

export const MovieListQuery = z.object({
  popular: z
    .preprocess(
      (value) => {
        if (value === undefined || value === null) return undefined
        return String(value)
      },
      z
        .string()
        .refine((value) => value === 'true' || value === 'false', {
          message: 'value must be "true" or "false"',
        })
        .transform((value) => value === 'true'),
    )
    .optional(),
  page: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: 'page must be a valid number',
    })
    .transform((value) => parseInt(value))
    .optional(),
})

export type MovieListQuery = {
  popular?: boolean
  page?: number
}

export const MovieListSchema = z.object({
  query: MovieListQuery,
})
export const MovieDetailParams = z.object({
  id: z.string().refine((value) => !isNaN(Number(value)), {
    message: 'id must be a valid number',
  }),
})

export const MovieDetailSchema = z.object({
  params: MovieDetailParams,
})
export type SwipeDirection = 'right' | 'left' | 'up'

export const MovieSwipeBody = z.object({
  swipe_direction: z.string().refine(
    (direction) => {
      return ['right', 'left', 'up'].includes(direction as SwipeDirection)
    },
    {
      message: 'Invalid swipe direction',
    },
  ),
})
export const MovieSwipeSchema = z.object({
  params: MovieDetailParams,
  body: MovieSwipeBody,
})

export type MovieDetailParams = z.infer<typeof MovieDetailParams>
export type MovieSwipeBody = z.infer<typeof MovieSwipeBody>
