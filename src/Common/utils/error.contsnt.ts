import { AppConstants } from "./app.constant";

export const ErrorConstants = {
    // Authentication & Validation Errors
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_INVALID_FORMAT: 'Invalid username format. Username must be alphanumeric and 3-30 characters long.',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: `Password must be at least ${AppConstants.PASSWORD_MIN_LENGTH} characters`,
    USERNAME_TAKEN: 'Username is already taken',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_SUSPENDED: 'Account is suspended. Please contact support.',
  
    // General Errors
    UNAUTHORIZED: 'Unauthorized access',
  };
  