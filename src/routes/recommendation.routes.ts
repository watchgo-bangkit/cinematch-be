import { Router } from "express";
import authenticateToken, { AuthRequest } from "../middlewares/auth";
import { getRecommendation } from "../scripts/getRecommendation";
import { getRecommendationsMovieDetail } from "../dao/recommendation.dao";
import { getWatchlist } from "../services/watchlist.service";
import { getTMDBMovieList } from "../services/tmdb.services";

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const watchlists = await getWatchlist(userId);
        
        if (watchlists.length < 10) {
            // Fetch 20 most popular movies from TMDB
            const popularMovies = await getTMDBMovieList(1, true);
            const popularMoviesDetails = popularMovies.movies.slice(0, 20).map(movie => ({
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
            }));
            return res.json(popularMoviesDetails);
        }
        
        const recommendationsWithDetail = [];
        while (recommendationsWithDetail.length < 20) {
            const recommendations = await getRecommendation(userId, 0.3);
            if (recommendations) {
                const detailPromises = recommendations.map(async (recommendation) => {
                    const recommendationWithDetail = await getRecommendationsMovieDetail(recommendation);
                    if (!recommendationWithDetail.adult) {
                        return {
                            movie_id: recommendation,
                            title: recommendationWithDetail.title,
                            poster_path: recommendationWithDetail.poster_path,
                        };
                    }
                });

                const details = await Promise.all(detailPromises);
                recommendationsWithDetail.push(...details.filter(Boolean));
            }
        }

        res.json(recommendationsWithDetail.slice(0, 20));
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
