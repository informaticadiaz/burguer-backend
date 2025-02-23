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