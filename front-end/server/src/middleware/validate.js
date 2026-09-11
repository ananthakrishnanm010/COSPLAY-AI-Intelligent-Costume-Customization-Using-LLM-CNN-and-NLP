import AppError from '../utils/AppError.js';

/**
 * Validation middleware factory.
 * Accepts a validator function that returns an array of error objects.
 * Passes to the global error handler if validation fails.
 *
 * Validator function signature: (body) => [{ field, message }, ...]
 * Returns empty array if valid.
 */
const validate = (validatorFn) => {
  return (req, _res, next) => {
    const errors = validatorFn(req.body);

    if (errors && errors.length > 0) {
      const err = new AppError('Validation failed', 400);
      err.errors = errors;
      return next(err);
    }

    next();
  };
};

export default validate;
