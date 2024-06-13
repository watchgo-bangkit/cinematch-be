import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWatchlist = async (userId: number) => {
    return await prisma.watchlist.findMany({
        where: { user_id: userId },
    });
};

export const addWatchlistItem = async (data: {
    user_id: number,
    movie_id: number,
    genres: string[],
    released_year: number,
    runtime: number,
    vote_average: number,
    casts: string[],
    liked: boolean,
    is_watched: boolean,
    }) => {
    // Check if the movie already exists in the user's watchlist
    const existingItem = await prisma.watchlist.findFirst({
        where: {
        user_id: data.user_id,
        movie_id: data.movie_id,
        },
    });

    if (existingItem) {
        throw new Error('Movie is already in the watchlist');
    }

    return await prisma.watchlist.create({ data });
};

export const deleteWatchlistItem = async (id: number, userId: number) => {
    const watchlistItem = await prisma.watchlist.findFirst({
        where: {
            id,
            user_id: userId,
        },
        });
    
        if (!watchlistItem) {
        throw new Error('Watchlist item not found');
        }
    
        await prisma.watchlist.delete({ where: { id } });
        return { message: 'Watchlist item deleted successfully' };
};
