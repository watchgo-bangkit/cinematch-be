import { Router } from 'express';
import { getWatchlist, addWatchlistItem, updateWatchlistItem } from '../services/watchlist.service';
import authenticateToken, { AuthRequest } from '../middlewares/auth';
import { getWatchlistMovieDetail } from '../dao/watchlist.dao';

const router = Router();

// Type guard to check if error is an instance of Error
const isError = (error: unknown): error is Error => {
    return error instanceof Error;
};

// Get all watchlist items for the logged-in user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const watchlists = await getWatchlist(userId);
        const watchlistsWithDetails = [];
        for (const watchlist of watchlists) {
            const watchlistMovieDetail = await getWatchlistMovieDetail(watchlist.movie_id);
            watchlistsWithDetails.push({
                id: watchlist.id,
                movie_id: watchlist.movie_id,
                title: watchlistMovieDetail.title,
                poster_path: watchlistMovieDetail.poster_path,
                released_year: watchlistMovieDetail.release_date.slice(0, 4),
                runtime: watchlistMovieDetail.runtime,
                vote_average: watchlistMovieDetail.vote_average,
                like: watchlist.liked,
                is_watched: watchlist.is_watched,
            });
        }

        res.json(watchlistsWithDetails);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new watchlist item for the logged-in user
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { movie_id, liked, is_watched } = req.body;
        const newWatchlistItem = await addWatchlistItem({
            user_id: userId,
            movie_id,
            liked,
            is_watched,
        });
        res.status(201).json(newWatchlistItem);
    } catch (error) {
        if (isError(error) && error.message === 'Movie is already in the watchlist') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Update a watchlist item by ID
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
    const { id } = req.params;
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await updateWatchlistItem(parseInt(id), userId);
        res.status(200).json(result);
    } catch (error) {
        if (isError(error) && error.message === 'Watchlist item not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

export default router;
