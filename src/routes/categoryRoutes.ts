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

