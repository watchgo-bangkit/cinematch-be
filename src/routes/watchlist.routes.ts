import { Router } from 'express';
import { getWatchlist, addWatchlistItem, deleteWatchlistItem } from '../services/watchlist.service';
import authenticateToken, { AuthRequest } from '../middlewares/auth';

const router = Router();

// Type guard to check if error is an instance of Error
const isError = (error: unknown): error is Error => {
    return error instanceof Error;
};

// Get all watchlist items for the logged-in user
router.get('/:userId', authenticateToken, async (req: AuthRequest, res) => {
    const { userId } = req.params;
    if (req.user?.userId !== parseInt(userId)) {
        return res.status(403).json({ error: 'Access denied. Invalid user ID.' });
    }

    try {
        const watchlist = await getWatchlist(parseInt(userId));
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new watchlist item for the logged-in user
router.post('/:userId', authenticateToken, async (req: AuthRequest, res) => {
    const { userId } = req.params;
    if (req.user?.userId !== parseInt(userId)) {
        return res.status(403).json({ error: 'Access denied. Invalid user ID.' });
    }

    const { movie_id, genres, released_year, runtime, vote_average, casts, liked } = req.body;
    try {
        const newWatchlistItem = await addWatchlistItem({
        user_id: parseInt(userId),
        movie_id,
        genres,
        released_year,
        runtime,
        vote_average,
        casts,
        liked,
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

// Delete a watchlist item by ID
router.delete('/:userId/:id', authenticateToken, async (req: AuthRequest, res) => {
    const { userId, id } = req.params;
    if (req.user?.userId !== parseInt(userId)) {
        return res.status(403).json({ error: 'Access denied. Invalid user ID.' });
    }
    try {
        const result = await deleteWatchlistItem(parseInt(id), parseInt(userId));
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
