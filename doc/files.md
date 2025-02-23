# Files to projec

```ts
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
```

```ts
// src/config/env.ts
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  // Añadir más variables de entorno según sea necesario
};

// Validar variables de entorno requeridas
const requiredEnvVars = ['DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

```ts
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log el error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  // En desarrollo, incluir el stack trace
  const response = {
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
};
```

```ts
// src/utils/logger.ts
import winston from 'winston';
import { env } from '../config/env';

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Añadir más transportes según sea necesario (archivo, etc.)
  ],
});

export default logger;
```

```ts
// src/services/menuService.ts
import prisma from '../config/database';
import { MenuItem } from '@prisma/client';
import logger from '../utils/logger';

interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  isAvailable?: boolean;
  isPopular?: boolean;
  customizationOptions?: {
    name: string;
    price: number;
    isAvailable?: boolean;
    groupName?: string;
    isMutuallyExclusive?: boolean;
  }[];
}

interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}

export const menuService = {
  // Get all menu items
  async getAllItems() {
    try {
      return await prisma.menuItem.findMany({
        include: {
          category: true,
          customizationOptions: true,
        },
        where: {
          deletedAt: null,
        },
      });
    } catch (error) {
      logger.error('Error in getAllItems:', error);
      throw error;
    }
  },

  // Get menu item by id
  async getItemById(id: number) {
    try {
      return await prisma.menuItem.findUnique({
        where: { id, deletedAt: null },
        include: {
          category: true,
          customizationOptions: true,
        },
      });
    } catch (error) {
      logger.error(`Error in getItemById for id ${id}:`, error);
      throw error;
    }
  },

  // Create new menu item
  async createItem(data: CreateMenuItemDto) {
    try {
      return await prisma.menuItem.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId,
          isAvailable: data.isAvailable ?? true,
          isPopular: data.isPopular ?? false,
          customizationOptions: {
            create: data.customizationOptions,
          },
        },
        include: {
          category: true,
          customizationOptions: true,
        },
      });
    } catch (error) {
      logger.error('Error in createItem:', error);
      throw error;
    }
  },

  // Update menu item
  async updateItem(id: number, data: UpdateMenuItemDto) {
    try {
      return await prisma.menuItem.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId,
          isAvailable: data.isAvailable,
          isPopular: data.isPopular,
          updatedAt: new Date(),
        },
        include: {
          category: true,
          customizationOptions: true,
        },
      });
    } catch (error) {
      logger.error(`Error in updateItem for id ${id}:`, error);
      throw error;
    }
  },

  // Soft delete menu item
  async deleteItem(id: number) {
    try {
      return await prisma.menuItem.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      logger.error(`Error in deleteItem for id ${id}:`, error);
      throw error;
    }
  },

  // Get menu items by category
  async getItemsByCategory(categoryId: number) {
    try {
      return await prisma.menuItem.findMany({
        where: {
          categoryId,
          deletedAt: null,
        },
        include: {
          category: true,
          customizationOptions: true,
        },
      });
    } catch (error) {
      logger.error(`Error in getItemsByCategory for categoryId ${categoryId}:`, error);
      throw error;
    }
  },
};
```

```ts
// src/routes/menuRoutes.ts
import express from 'express';
import { menuController } from '../controllers/menuController';
import { validateMenuItem } from '../middleware/validation';

const router = express.Router();

// Get all menu items
router.get('/', menuController.getAllItems);

// Get menu item by id
router.get('/:id', menuController.getItemById);

// Create new menu item
router.post('/', validateMenuItem, menuController.createItem);

// Update menu item
router.put('/:id', validateMenuItem, menuController.updateItem);

// Delete menu item
router.delete('/:id', menuController.deleteItem);

// Get menu items by category
router.get('/category/:categoryId', menuController.getItemsByCategory);

export default router;
```

```ts
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation rules for menu items
export const validateMenuItem = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isInt({ min: 1 })
    .withMessage('Invalid category ID'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid image URL'),
  
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  
  body('isPopular')
    .optional()
    .isBoolean()
    .withMessage('isPopular must be a boolean'),
  
  body('customizationOptions')
    .optional()
    .isArray()
    .withMessage('Customization options must be an array'),
  
  body('customizationOptions.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Customization option name is required')
    .isLength({ max: 100 })
    .withMessage('Customization option name must be less than 100 characters'),
  
  body('customizationOptions.*.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Customization option price must be a positive number'),

  // Validate the request after all rules
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      });
    }
    next();
  }
];

// Add more validation middleware as needed for other routes
```

```ts
// src/controllers/menuController.ts
import { Request, Response, NextFunction } from 'express';
import { menuService } from '../services/menuService';
import logger from '../utils/logger';

export const menuController = {
  // Get all menu items
  async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await menuService.getAllItems();
      res.json(items);
    } catch (error) {
      logger.error('Error getting all menu items:', error);
      next(error);
    }
  },

  // Get menu item by id
  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const item = await menuService.getItemById(id);
      
      if (!item) {
        return res.status(404).json({
          error: {
            message: 'Menu item not found',
            code: 'ITEM_NOT_FOUND'
          }
        });
      }
      
      res.json(item);
    } catch (error) {
      logger.error(`Error getting menu item with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Create new menu item
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const newItem = await menuService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      logger.error('Error creating menu item:', error);
      next(error);
    }
  },

  // Update menu item
  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await menuService.updateItem(id, req.body);
      
      if (!updatedItem) {
        return res.status(404).json({
          error: {
            message: 'Menu item not found',
            code: 'ITEM_NOT_FOUND'
          }
        });
      }
      
      res.json(updatedItem);
    } catch (error) {
      logger.error(`Error updating menu item with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Delete menu item
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await menuService.deleteItem(id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting menu item with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Get menu items by category
  async getItemsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const items = await menuService.getItemsByCategory(categoryId);
      res.json(items);
    } catch (error) {
      logger.error(`Error getting menu items for category ${req.params.categoryId}:`, error);
      next(error);
    }
  }
};
```

```ts
// src/app.ts
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import menuRoutes from './routes/menuRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/menu-items', menuRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
```