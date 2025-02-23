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