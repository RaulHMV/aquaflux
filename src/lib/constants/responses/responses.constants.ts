// ==========================================
// RESPONSE HELPERS
// ==========================================

export const SUCCESS_JSON_RESPONSE = <T = unknown>(status: number, message: string, data: T) => {
  return {
    status,
    message,
    data
  };
};

export const ERROR_JSON_RESPONSE = (status: number, message: string, error?: unknown) => {
  return {
    status,
    message,
    error
  };
};

// Success Messages
export const SUCCESS_ON_CREATE = (entity: string): string => `${entity} created successfully.`;
export const SUCCESS_ON_UPDATE = (entity: string): string => `${entity} updated successfully.`;
export const SUCCESS_ON_DELETE = (entity: string): string => `${entity} deleted successfully.`;
export const SUCCESS_ON_FETCH = (entity: string): string => `${entity} fetched successfully.`;
export const SUCCESS_ON_LIST = (entity: string): string => `${entity} list fetched successfully.`;
export const SUCCESS_ON_RESTORE = (entity: string): string => `${entity} restored successfully.`;
