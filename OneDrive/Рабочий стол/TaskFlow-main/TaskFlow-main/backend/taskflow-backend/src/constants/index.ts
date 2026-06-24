export const APP_NAME = 'TaskFlow API';
export const API_PREFIX = '/api';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
} as const;

export const HTTP_MESSAGES = {
  HEALTH_OK: 'Service is healthy',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
} as const;
