// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        [key: string]: any;
      };
    }
  }
}

interface JwtPayload {
  id: number;
  role: string;
  [key: string]: any;
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const auth = {
  // Verify JWT token middleware
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new AuthenticationError('No token provided');
      }

      // Get token from header (Bearer <token>)
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new AuthenticationError('Invalid token format');
      }

      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid token:', error.message);
        return res.status(401).json({
          error: {
            message: 'Invalid token',
            code: 'INVALID_TOKEN'
          }
        });
      }
      
      if (error instanceof AuthenticationError) {
        logger.warn('Authentication error:', error.message);
        return res.status(401).json({
          error: {
            message: error.message,
            code: 'AUTH_ERROR'
          }
        });
      }

      logger.error('Authentication error:', error);
      next(error);
    }
  },

  // Role-based access control middleware
  requireRole: (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new AuthenticationError('User not authenticated');
        }

        if (!allowedRoles.includes(req.user.role)) {
          logger.warn(`User ${req.user.id} with role ${req.user.role} attempted to access restricted resource`);
          return res.status(403).json({
            error: {
              message: 'Insufficient permissions',
              code: 'FORBIDDEN'
            }
          });
        }

        next();
      } catch (error) {
        if (error instanceof AuthenticationError) {
          return res.status(401).json({
            error: {
              message: error.message,
              code: 'AUTH_ERROR'
            }
          });
        }
        next(error);
      }
    };
  },

  // Optional authentication middleware
  // Allows both authenticated and unauthenticated requests
  optionalAuth: (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next();
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return next();
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      // If token is invalid, continue without user info
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid token in optional auth:', error.message);
        return next();
      }
      next(error);
    }
  },

  // Generate JWT token
  generateToken: (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });
  },

  // Refresh token middleware
  refreshToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AuthenticationError('No refresh token provided');
      }

      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
      const newToken = auth.generateToken({
        id: decoded.id,
        role: decoded.role
      });

      res.json({
        token: newToken,
        expiresIn: env.JWT_EXPIRES_IN
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid refresh token:', error.message);
        return res.status(401).json({
          error: {
            message: 'Invalid refresh token',
            code: 'INVALID_REFRESH_TOKEN'
          }
        });
      }
      next(error);
    }
  }
};

// Example usage in routes:
/*
// Require authentication for all routes in this router
router.use(auth.verifyToken);

// Require specific role for this route
router.post('/admin/users', auth.requireRole(['admin']), adminController.createUser);

// Optional authentication
router.get('/products', auth.optionalAuth, productController.getProducts);

// Protected route with multiple allowed roles
router.put('/orders/:id', 
  auth.verifyToken,
  auth.requireRole(['admin', 'manager']),
  orderController.updateOrder
);
*/

export default auth;