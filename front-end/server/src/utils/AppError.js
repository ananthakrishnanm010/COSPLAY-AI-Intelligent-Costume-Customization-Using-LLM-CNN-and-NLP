/**
 * Custom operational error class.
 * Attach an HTTP statusCode to any thrown error so the global error
 * handler can respond with the correct HTTP status code.
 *
 * Usage:  throw new AppError('Product not found', 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Distinguish from unexpected programmer errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
