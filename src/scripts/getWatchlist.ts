import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWatchlist = async (userId: number) => {
    const watchlistItems = await prisma.watchlist.findMany({
        select: {
            movie_id: true,
            liked: true
        },
        where: { user_id: userId },
    });
    // Convert array to a dictionary for easier access
    return watchlistItems.reduce((
        acc: any, 
        item: {movie_id: number, liked: boolean}
    ) => {
        acc[item.movie_id] = item.liked ? 1 : 0;
        return acc;
    }, {});
};