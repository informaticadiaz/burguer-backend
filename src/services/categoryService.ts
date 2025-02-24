// src/services/categoryService.ts
import prisma from '../config/database.js';
import logger from '../utils/logger.js';

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

