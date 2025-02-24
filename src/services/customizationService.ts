// src/services/customizationService.ts
import prisma from '../config/database.js';
import logger from '../utils/logger.js';

interface CreateCustomizationDto {
  name: string;
  price: number;
  menuItemId: number;
  isAvailable?: boolean;
  groupName?: string;
  isMutuallyExclusive?: boolean;
}

interface UpdateCustomizationDto extends Partial<CreateCustomizationDto> {}

export const customizationService = {
  // Get all customization options for a menu item
  async getCustomizationsByMenuItem(menuItemId: number) {
    try {
      return await prisma.customizationOption.findMany({
        where: {
          menuItemId
        },
        orderBy: {
          groupName: 'asc'
        }
      });
    } catch (error) {
      logger.error(`Error in getCustomizationsByMenuItem for menuItemId ${menuItemId}:`, error);
      throw error;
    }
  },

  // Get customization option by id
  async getCustomizationById(id: number) {
    try {
      return await prisma.customizationOption.findUnique({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error in getCustomizationById for id ${id}:`, error);
      throw error;
    }
  },

  // Create new customization option
  async createCustomization(data: CreateCustomizationDto) {
    try {
      return await prisma.customizationOption.create({
        data: {
          name: data.name,
          price: data.price,
          menuItemId: data.menuItemId,
          isAvailable: data.isAvailable ?? true,
          groupName: data.groupName,
          isMutuallyExclusive: data.isMutuallyExclusive ?? false
        }
      });
    } catch (error) {
      logger.error('Error in createCustomization:', error);
      throw error;
    }
  },

  // Update customization option
  async updateCustomization(id: number, data: UpdateCustomizationDto) {
    try {
      return await prisma.customizationOption.update({
        where: { id },
        data: {
          name: data.name,
          price: data.price,
          isAvailable: data.isAvailable,
          groupName: data.groupName,
          isMutuallyExclusive: data.isMutuallyExclusive,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      logger.error(`Error in updateCustomization for id ${id}:`, error);
      throw error;
    }
  },

  // Delete customization option
  async deleteCustomization(id: number) {
    try {
      return await prisma.customizationOption.delete({
        where: { id }
      });
    } catch (error) {
      logger.error(`Error in deleteCustomization for id ${id}:`, error);
      throw error;
    }
  }
};