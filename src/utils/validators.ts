// src/utils/validators.ts

/**
 * Collection of utility functions for common validation tasks
 */

// Price validation
export const isPriceValid = (price: number): boolean => {
    return typeof price === 'number' && price >= 0 && !isNaN(price) && isFinite(price);
  };
  
  // String length validation with trimming
  export const isValidLength = (str: string, minLength: number, maxLength: number): boolean => {
    const trimmed = str.trim();
    return trimmed.length >= minLength && trimmed.length <= maxLength;
  };
  
  // URL validation for images
  export const isValidImageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      const validProtocols = ['http:', 'https:'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      return (
        validProtocols.includes(parsed.protocol) &&
        validExtensions.some(ext => parsed.pathname.toLowerCase().endsWith(ext))
      );
    } catch {
      return false;
    }
  };
  
  // Validate integer ID
  export const isValidId = (id: any): boolean => {
    const parsed = parseInt(id);
    return !isNaN(parsed) && parsed > 0 && parsed === Number(id);
  };
  
  // Validate array of IDs
  export const areValidIds = (ids: any[]): boolean => {
    return Array.isArray(ids) && ids.every(id => isValidId(id));
  };
  
  // Validate boolean fields that might come as strings
  export const parseBoolean = (value: any): boolean | null => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
  };
  
  // Validate and sanitize order number
  export const isValidOrder = (order: number): boolean => {
    return Number.isInteger(order) && order >= 0;
  };
  
  // Validate customization option group name
  export const isValidGroupName = (name: string): boolean => {
    return typeof name === 'string' && 
           name.trim().length > 0 && 
           name.trim().length <= 50 && 
           /^[a-zA-Z0-9_\- ]+$/.test(name);
  };
  
  // Validate that an object has required fields
  export const hasRequiredFields = (obj: any, requiredFields: string[]): boolean => {
    return requiredFields.every(field => {
      const value = obj[field];
      return value !== undefined && value !== null && value !== '';
    });
  };
  
  // Validate date format
  export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };
  
  // Validate phone number format (basic implementation)
  export const isValidPhoneNumber = (phone: string): boolean => {
    // This is a basic example - adjust the regex according to your needs
    return /^\+?[\d\s-]{8,}$/.test(phone);
  };
  
  // Validate email format
  export const isValidEmail = (email: string): boolean => {
    // Basic email validation - can be enhanced based on requirements
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Sanitize string input
  export const sanitizeString = (str: string): string => {
    return str.trim().replace(/[<>]/g, '');
  };
  
  // Validate currency amount
  export const isValidCurrencyAmount = (amount: number): boolean => {
    return typeof amount === 'number' && 
           amount >= 0 && 
           !isNaN(amount) && 
           isFinite(amount) && 
           Number(amount.toFixed(2)) === amount;
  };
  
  /**
   * Validates a menu item object has all required fields and correct types
   */
  export const isValidMenuItem = (item: any): boolean => {
    const requiredFields = ['name', 'price', 'categoryId'];
    const hasRequired = hasRequiredFields(item, requiredFields);
    
    return hasRequired && 
           isValidLength(item.name, 1, 100) && 
           isPriceValid(item.price) && 
           isValidId(item.categoryId) &&
           (!item.imageUrl || isValidImageUrl(item.imageUrl));
  };