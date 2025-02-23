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

