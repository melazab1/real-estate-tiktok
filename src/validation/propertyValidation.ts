
import type { Property } from '@/types/job';

export const validateProperty = (property: Property | null): boolean => {
  if (!property) return false;
  
  // Basic validation - at least title should be present
  return Boolean(property.title?.trim());
};

export const validatePropertyField = (field: keyof Property, value: any): boolean => {
  switch (field) {
    case 'title':
      return Boolean(value?.trim());
    case 'price':
      return value === null || value === undefined || (Number(value) >= 0);
    case 'bedrooms':
    case 'bathrooms':
      return value === null || value === undefined || (Number(value) >= 0 && Number.isInteger(Number(value)));
    case 'area':
      return value === null || value === undefined || (Number(value) >= 0);
    default:
      return true;
  }
};

export const sanitizePropertyValue = (field: keyof Property, value: any): any => {
  switch (field) {
    case 'title':
    case 'description':
    case 'location':
    case 'additional_info':
      return typeof value === 'string' ? value.trim() : value;
    case 'price':
    case 'area':
      return value === '' || value === null ? null : Number(value);
    case 'bedrooms':
    case 'bathrooms':
      return value === '' || value === null ? null : Math.floor(Number(value));
    default:
      return value;
  }
};
