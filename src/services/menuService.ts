// src/services/menuService.ts
import prisma from '../config/database.js';
import logger from '../utils/logger.js';

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