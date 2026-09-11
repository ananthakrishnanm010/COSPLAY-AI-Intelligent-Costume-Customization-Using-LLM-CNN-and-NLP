import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import prisma from '../config/prismaClient.js';

/**
 * Middleware: Verify the JWT token in Authorization header.
 * Attaches the authenticated user object to req.user on success.
 */
export const protect = catchAsync(async (req, _res, next) => {
  // 1. Get token from Authorization header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // 2. Verify token signature and expiry
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4. Attach user to request
  req.user = currentUser;
  next();
});

/**
 * Middleware: Restrict access to specific roles.
 * Must be used AFTER protect middleware.
 *
 * Usage: router.delete('/product/:id', protect, restrictTo('admin'), deleteProduct)
 */
export const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
