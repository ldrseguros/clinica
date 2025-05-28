import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload for type safety

const router = Router();
const prisma = new PrismaClient();

/**
 * @route   GET /api/users/profile
 * @desc    Fetches the profile of the currently authenticated user.
 * @access  Private (Requires Bearer token in Authorization header)
 *
 * @requires Authentication (Bearer token)
 *
 * @returns {object} 200 - User object (id, name, email, createdAt, updatedAt).
 * @returns {Error}  401 - Unauthorized (e.g., token missing, invalid token, token payload invalid).
 * @returns {Error}  404 - Not Found (user associated with the token's userId not found).
 * @returns {Error}  500 - Internal Server Error.
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userPayload = req.user as JwtPayload;

    if (!userPayload || !userPayload.userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload.' });
    }

    const userId = userPayload.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Internal server error fetching profile.', details: error.message });
    }
    res.status(500).json({ message: 'Internal server error fetching profile.' });
  }
});

export default router;
