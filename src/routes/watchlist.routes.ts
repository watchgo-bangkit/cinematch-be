import { Router } from 'express';
import { getWatchlist, addWatchlistItem, deleteWatchlistItem, rateWatchlistItem } from '../services/watchlist.service';
import authenticateToken, { AuthRequest } from '../middlewares/auth';

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
        const watchlist = await getWatchlist(userId);
        res.json(watchlist);
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

        const { movie_id, genres, released_year, runtime, vote_average, casts, liked } = req.body;
        const newWatchlistItem = await addWatchlistItem({
            user_id: userId,
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
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
    const { id } = req.params;
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await deleteWatchlistItem(parseInt(id), userId);
        res.status(200).json(result);
    } catch (error) {
        if (isError(error) && error.message === 'Watchlist item not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.put('rate/:id', authenticateToken, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { rating } = req.body; 
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Ensure the rating is a valid number
        if (typeof rating !== 'number' || rating < 0 || rating > 10) {
            return res.status(400).json({ error: 'Invalid rating. Rating must be a number between 0 and 10.' });
        }

        const movie_id = parseInt(id);
        if (isNaN(movie_id)) {
            return res.status(400).json({ error: 'Invalid movie ID' });
        }

        const updatedItem = await rateWatchlistItem({
            user_id: userId,
            movie_id: movie_id,
            rating: rating,
        });
        res.status(200).json(updatedItem);
    } catch (error) {
        if (isError(error) && error.message === 'Watchlist item not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})

export default router;
