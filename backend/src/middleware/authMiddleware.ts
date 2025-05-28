import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Ensure JWT_SECRET is loaded from .env, with a fallback for safety (though .env is preferred)
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET_KEY_HERE_PLEASE_REPLACE_AND_MOVE_TO_ENV";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided or token malformed.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token malformed.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user payload to request object

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
        // Specific JWT errors (e.g., malformed, signature invalid)
        return res.status(401).json({ message: 'Unauthorized: Invalid token.', details: error.message });
    } else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Unauthorized: Token expired.', details: error.message });
    }
    // Generic error for other cases
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

export default authMiddleware; // Also exporting as default for flexibility if needed
