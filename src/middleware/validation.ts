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