import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: { userId: number; email: string };
}

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'secretKey';
        const decoded = jwt.verify(token, secret) as { userId: number; email: string };

        // Check if user exists in the database
        const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId,
        },
        });

        if (!user) {
        return res.status(401).json({ error: 'User not found.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export default authenticateToken;
