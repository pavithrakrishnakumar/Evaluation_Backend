// src/constants/app.constants.ts
export const AppConstants = {
    // Validation patterns
    USERNAME_REGEX: /^[a-zA-Z0-9]{3,30}$/, // Alphanumeric, 3 to 30 characters
    PASSWORD_MIN_LENGTH: 6,
  
    // JWT & Auth
    JWT_EXPIRATION_TIME: '1h', // Token expiration time for JWT
    SALT_ROUNDS: 10, // Salt rounds for password hashing
    REDIS_EXPIRATION: 3600, // Redis token expiry (in seconds)
  };
  