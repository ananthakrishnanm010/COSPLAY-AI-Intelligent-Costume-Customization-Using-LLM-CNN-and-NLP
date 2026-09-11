/**
 * Validates registration payload.
 * @returns {Array} Array of { field, message } error objects, or empty array if valid.
 */
export const validateRegister = ({ name, email, password }) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!password || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
  }

  return errors;
};

/**
 * Validates login payload.
 */
export const validateLogin = ({ email, password }) => {
  const errors = [];

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  return errors;
};
