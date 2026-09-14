/**
 * Wraps async route handlers to automatically catch rejected promises
 * and forward them to Express's next() error handler, eliminating
 * the need for try/catch blocks in every controller.
 *
 * Usage: router.get('/path', catchAsync(async (req, res) => { ... }));
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
