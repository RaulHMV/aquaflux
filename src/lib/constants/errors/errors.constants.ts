// ==========================================
// ERROR CONSTANTS
// ==========================================

// General Errors
export const DEFAULT_INTERNAL_ERROR = 'An internal error occurred. Please try again later.';
export const BAD_REQUEST = 'Bad request. Please check your input and try again.';
export const UNAUTHORIZED = 'Unauthorized access. Please log in again.';
export const SERVER_ERROR = (errorMessage: unknown) => `Server Error -> ${errorMessage}`;

// JWT Errors
export const JWT_SECRET_NOT_CONFIGURED = 'JWT secret is not configured. Please check your environment variables.';
export const FAILED_TO_GENERATE_TOKEN = 'Failed to generate token. Please try again later.';
export const INVALID_TOKEN_FORMAT = 'Invalid token format. Please provide a valid token.';

// User Errors
export const NO_USER_PAYLOAD = 'No user payload provided. Please provide a valid user payload.';
export const NO_USER_FOUND = 'No user found with the provided credentials. Please check your username and password.';
export const USER_ALREADY_EXISTS = (username: string) => `User with username ${username} already exists. Please choose a different username.`;
export const USER_EMAIL_ALREADY_EXISTS = (email: string) => `User with email ${email} already exists. Please choose a different email.`;

// Validation Errors
export const VALIDATION_ERROR = (errorMessage: string) => `Validation error: ${errorMessage}`;

// Feed Related Errors
export const FEED_NOT_FOUND = (feedKey: string) => `Feed with key '${feedKey}' not found.`;
export const FEED_ALREADY_EXISTS = (feedKey: string) => `Feed with key '${feedKey}' already exists.`;
export const INVALID_FEED_KEY = (feedKey: string) => `Invalid feed key '${feedKey}'. Please use a valid feed key.`;
export const ADAFRUIT_IO_ERROR = (errorMessage: string) => `Adafruit IO Error: ${errorMessage}`;
export const ADAFRUIT_IO_UNAUTHORIZED = 'Unauthorized access to Adafruit IO. Please check your credentials.';
export const ADAFRUIT_IO_RATE_LIMIT = 'Adafruit IO rate limit exceeded. Please try again later.';
export const INVALID_DATA_VALUE = 'Invalid data value. Please provide a valid numeric or string value.';
export const NO_DATA_AVAILABLE = (feedKey: string) => `No data available for feed '${feedKey}'.`;
export const FEED_CREATION_FAILED = (feedKey: string) => `Failed to create feed '${feedKey}' on Adafruit IO.`;
export const DATA_CREATION_FAILED = (feedKey: string) => `Failed to create data point for feed '${feedKey}'.`;
