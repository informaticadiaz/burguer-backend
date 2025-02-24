// src/routes/customizationRoutes.ts
import express from 'express';
import { customizationController } from '../controllers/customizationController.js';
import { validateCustomization } from '../middleware/validation.js';

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

