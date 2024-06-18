import { Router } from "express"
import authenticateToken, { AuthRequest } from "../middlewares/auth";
import { getRecommendation } from "../scripts/getRecommendation";
import { getRecommendationsMovieDetail } from "../dao/recommendation.dao";
import { title } from "process";

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const recommendations = await getRecommendation(userId, 0.5)
        const recommendationsWithDetail = []
        for (const recommendation in recommendations) {
            const recommendationDetails = await getRecommendationsMovieDetail(parseInt(recommendation))
            recommendationsWithDetail.push({
                movie_id: recommendation,
                title: recommendationDetails.title,
                poster_path: recommendationDetails.poster_path,
            })
        }
        res.json(recommendationsWithDetail);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router
