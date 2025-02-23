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

