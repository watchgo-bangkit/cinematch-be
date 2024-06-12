import { z } from 'zod'

export const AddReviewBody = z.object({
  title: z.string(),
  review: z.string(),
  rating: z.number().min(1).max(5),
})
export const ReviewWatchlistParams = z.object({
  watchlist_id: z.string().refine((value) => !isNaN(Number(value)), {
    message: 'watchlist id must be a valid number',
  }),
})

export const AddReviewSchema = z.object({
  body: AddReviewBody,
  params: ReviewWatchlistParams,
})
export const getAllReviewSchema = z.object({
  params: ReviewWatchlistParams,
})

export type AddReviewSchema = z.infer<typeof AddReviewSchema>
export type ReviewWatchlistParams = z.infer<typeof ReviewWatchlistParams>
export type AddReviewBody = z.infer<typeof AddReviewBody>
