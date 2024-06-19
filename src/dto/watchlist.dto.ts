import { z } from 'zod'

export const WatchlistDetailParams = z.object({
  id: z.string().refine((value) => !isNaN(Number(value)), {
    message: 'id must be a valid number',
  }),
})
export const UpdateWatchlistBody = z.object({
  is_watched: z.boolean(),
})
export const UpdateWatchlistSchema = z.object({
  params: WatchlistDetailParams,
  body: UpdateWatchlistBody,
})

export type UpdateWatchlistBody = z.infer<typeof UpdateWatchlistBody>
