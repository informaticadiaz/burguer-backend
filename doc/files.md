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
// src/services/customizationService.ts
import prisma from '../config/database';
import logger from '../utils/logger';

interface CreateCustomizationDto {
  name: string;
  price: number;
  menuItemId: number;
  isAvailable?: boolean;
  groupName?: string;
  isMutuallyExclusive?: boolean;
}

interface UpdateCustomizationDto extends Partial<CreateCustomizationDto> {}

export const customizationService = {
  // Get all customization options for a menu item
  async getCustomizationsByMenuItem(menuItemId: number) {
    try {
      return await prisma.customizationOption.findMany({
        where: {
          menuItemId
        },
        orderBy: {
          groupName: 'asc'
        }
      });
    } catch (error) {
      logger.error(`Error in getCustomizationsByMenuItem for menuItemId ${menuItemId}:`, error);
      throw error;
    }
  },

  // Get customization option by id
  async getCustomizationById(id: number) {
    try {
      return await prisma.customizationOption.findUnique({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error in getCustomizationById for id ${id}:`, error);
      throw error;
    }
  },

  // Create new customization option
  async createCustomization(data: CreateCustomizationDto) {
    try {
      return await prisma.customizationOption.create({
        data: {
          name: data.name,
          price: data.price,
          menuItemId: data.menuItemId,
          isAvailable: data.isAvailable ?? true,
          groupName: data.groupName,
          isMutuallyExclusive: data.isMutuallyExclusive ?? false
        }
      });
    } catch (error) {
      logger.error('Error in createCustomization:', error);
      throw error;
    }
  },

  // Update customization option
  async updateCustomization(id: number, data: UpdateCustomizationDto) {
    try {
      return await prisma.customizationOption.update({
        where: { id },
        data: {
          name: data.name,
          price: data.price,
          isAvailable: data.isAvailable,
          groupName: data.groupName,
          isMutuallyExclusive: data.isMutuallyExclusive,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error(`Error in updateCustomization for id ${id}:`, error);
      throw error;
    }
  },

  // Delete customization option
  async deleteCustomization(id: number) {
    try {
      return await prisma.customizationOption.delete({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error in deleteCustomization for id ${id}:`, error);
      throw error;
    }
  }
};
```

```ts
// src/services/categoryService.ts
import prisma from '../config/database';
import logger from '../utils/logger';

interface CreateCategoryDto {
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      return await prisma.category.findMany({
        include: {
          menuItems: {
            where: {
              deletedAt: null
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      });
    } catch (error) {
      logger.error('Error in getAllCategories:', error);
      throw error;
    }
  },

  // Get category by id
  async getCategoryById(id: number) {
    try {
      return await prisma.category.findUnique({
        where: { id },
        include: {
          menuItems: {
            where: {
              deletedAt: null
            }
          }
        }
      });
    } catch (error) {
      logger.error(`Error in getCategoryById for id ${id}:`, error);
      throw error;
    }
  },

  // Create new category
  async createCategory(data: CreateCategoryDto) {
    try {
      return await prisma.category.create({
        data: {
          name: data.name,
          description: data.description,
          order: data.order ?? 0,
          isActive: data.isActive ?? true
        }
      });
    } catch (error) {
      logger.error('Error in createCategory:', error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id: number, data: UpdateCategoryDto) {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          order: data.order,
          isActive: data.isActive,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error(`Error in updateCategory for id ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id: number) {
    try {
      // First check if category has any active menu items
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          menuItems: {
            where: {
              deletedAt: null
            }
          }
        }
      });

      if (category?.menuItems.length ?? 0 > 0) {
        throw new Error('Cannot delete category with active menu items');
      }

      return await prisma.category.delete({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error in deleteCategory for id ${id}:`, error);
      throw error;
    }
  }
};
```

```ts
// src/routes/customizationRoutes.ts
import express from 'express';
import { customizationController } from '../controllers/customizationController';
import { validateCustomization } from '../middleware/validation';

const router = express.Router();

// Get all customization options for a menu item
router.get('/menu-item/:menuItemId', customizationController.getCustomizationsByMenuItem);

// Get customization option by id
router.get('/:id', customizationController.getCustomizationById);

// Create new customization option
router.post('/menu-item/:menuItemId', validateCustomization, customizationController.createCustomization);

// Update customization option
router.put('/:id', validateCustomization, customizationController.updateCustomization);

// Delete customization option
router.delete('/:id', customizationController.deleteCustomization);

export default router;
```

```ts
// src/routes/categoryRoutes.ts
import express from 'express';
import { categoryController } from '../controllers/categoryController';
import { validateCategory } from '../middleware/validation';

const router = express.Router();

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by id
router.get('/:id', categoryController.getCategoryById);

// Create new category
router.post('/', validateCategory, categoryController.createCategory);

// Update category
router.put('/:id', validateCategory, categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

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

// Agregar a src/middleware/validation.ts
export const validateCategory = [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description must be less than 200 characters'),
    
    body('order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order must be a non-negative integer'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  
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

  // Agregar a src/middleware/validation.ts
export const validateCustomization = [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name must be less than 100 characters'),
    
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),
    
    body('isAvailable')
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be a boolean'),
    
    body('groupName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Group name must be less than 50 characters'),
    
    body('isMutuallyExclusive')
      .optional()
      .isBoolean()
      .withMessage('isMutuallyExclusive must be a boolean'),
  
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
  ```

```ts
  // src/controllers/customizationController.ts
import { Request, Response, NextFunction } from 'express';
import { customizationService } from '../services/customizationService';
import logger from '../utils/logger';

export const customizationController = {
  // Get all customization options for a menu item
  async getCustomizationsByMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
      const menuItemId = parseInt(req.params.menuItemId);
      const customizations = await customizationService.getCustomizationsByMenuItem(menuItemId);
      res.json(customizations);
    } catch (error) {
      logger.error(`Error getting customizations for menu item ${req.params.menuItemId}:`, error);
      next(error);
    }
  },

  // Get customization option by id
  async getCustomizationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const customization = await customizationService.getCustomizationById(id);
      
      if (!customization) {
        return res.status(404).json({
          error: {
            message: 'Customization option not found',
            code: 'CUSTOMIZATION_NOT_FOUND'
          }
        });
      }
      
      res.json(customization);
    } catch (error) {
      logger.error(`Error getting customization with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Create new customization option
  async createCustomization(req: Request, res: Response, next: NextFunction) {
    try {
      const menuItemId = parseInt(req.params.menuItemId);
      const newCustomization = await customizationService.createCustomization({
        ...req.body,
        menuItemId
      });
      res.status(201).json(newCustomization);
    } catch (error) {
      logger.error('Error creating customization:', error);
      next(error);
    }
  },

  // Update customization option
  async updateCustomization(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const updatedCustomization = await customizationService.updateCustomization(id, req.body);
      
      if (!updatedCustomization) {
        return res.status(404).json({
          error: {
            message: 'Customization option not found',
            code: 'CUSTOMIZATION_NOT_FOUND'
          }
        });
      }
      
      res.json(updatedCustomization);
    } catch (error) {
      logger.error(`Error updating customization with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Delete customization option
  async deleteCustomization(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await customizationService.deleteCustomization(id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting customization with id ${req.params.id}:`, error);
      next(error);
    }
  }
};
```

```ts
// src/controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';
import logger from '../utils/logger';

export const categoryController = {
  // Get all categories
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      logger.error('Error getting all categories:', error);
      next(error);
    }
  },

  // Get category by id
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const category = await categoryService.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({
          error: {
            message: 'Category not found',
            code: 'CATEGORY_NOT_FOUND'
          }
        });
      }
      
      res.json(category);
    } catch (error) {
      logger.error(`Error getting category with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Create new category
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const newCategory = await categoryService.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      logger.error('Error creating category:', error);
      next(error);
    }
  },

  // Update category
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const updatedCategory = await categoryService.updateCategory(id, req.body);
      
      if (!updatedCategory) {
        return res.status(404).json({
          error: {
            message: 'Category not found',
            code: 'CATEGORY_NOT_FOUND'
          }
        });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      logger.error(`Error updating category with id ${req.params.id}:`, error);
      next(error);
    }
  },

  // Delete category
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Cannot delete category with active menu items') {
        return res.status(400).json({
          error: {
            message: error.message,
            code: 'CATEGORY_HAS_ITEMS'
          }
        });
      }
      logger.error(`Error deleting category with id ${req.params.id}:`, error);
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
import categoryRoutes from './routes/categoryRoutes';
import customizationRoutes from './routes/customizationRoutes';
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
app.use('/api/categories', categoryRoutes);
app.use('/api/customizations', customizationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

export default app;
```

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model MenuItem {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  imageUrl    String?
  categoryId  Int
  isAvailable Boolean  @default(true)
  isPopular   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
  
  category    Category    @relation(fields: [categoryId], references: [id])
  customizationOptions CustomizationOption[]

  @@map("menu_items")
}

model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  menuItems   MenuItem[]

  @@map("categories")
}

model CustomizationOption {
  id                  Int      @id @default(autoincrement())
  name                String
  price               Float    @default(0)
  isAvailable         Boolean  @default(true)
  groupName           String?
  isMutuallyExclusive Boolean  @default(false)
  menuItemId          Int
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  menuItem            MenuItem @relation(fields: [menuItemId], references: [id])

  @@map("customization_options")
}
```
