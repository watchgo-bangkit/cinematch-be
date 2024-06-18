import { Router } from "express"
import authenticateToken, { AuthRequest } from "../middlewares/auth";
import { getRecommendation } from "../scripts/getRecommendation";

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const recommendations = await getRecommendation(userId, 0.5);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router
