/**
 * Validate an email address
 * @param email Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a required field
 * @param value Value to validate
 * @returns Error message if invalid, null if valid
 */
export const validateRequired = (value: unknown): string | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return "This field is required";
  }
  return null;
};

/**
 * Validate minimum length
 * @param value Value to validate
 * @param minLength Minimum length
 * @returns Error message if invalid, null if valid
 */
export const validateMinLength = (
  value: string,
  minLength: number
): string | null => {
  if (!value) return null;

  if (value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Validate maximum length
 * @param value Value to validate
 * @param maxLength Maximum length
 * @returns Error message if invalid, null if valid
 */
export const validateMaxLength = (
  value: string,
  maxLength: number
): string | null => {
  if (!value) return null;

  if (value.length > maxLength) {
    return `Must be no more than ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate email format
 * @param value Email to validate
 * @returns Error message if invalid, null if valid
 */
export const validateEmail = (value: string): string | null => {
  if (!value) return null;

  if (!isValidEmail(value)) {
    return "Please enter a valid email address";
  }
  return null;
};

/**
 * Validate numeric value
 * @param value Value to validate
 * @returns Error message if invalid, null if valid
 */
export const validateNumeric = (value: string): string | null => {
  if (!value) return null;

  if (!/^\d+$/.test(value)) {
    return "Please enter a valid number";
  }
  return null;
};

/**
 * Validate numeric range
 * @param value Value to validate
 * @param min Minimum value
 * @param max Maximum value
 * @returns Error message if invalid, null if valid
 */
export const validateNumericRange = (
  value: string,
  min: number,
  max: number
): string | null => {
  if (!value) return null;

  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return "Please enter a valid number";
  }

  if (numericValue < min || numericValue > max) {
    return `Value must be between ${min} and ${max}`;
  }

  return null;
};
