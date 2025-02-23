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