import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository.js';

/**
 * Sign a JWT token for the given user ID.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Register a new customer user.
 */
export const register = async ({ name, email, password }) => {
  // Check if email is already taken
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await createUser({ name, email, password: hashedPassword });

  const token = signToken(user.id);
  return { user, token };
};

/**
 * Log in an existing user and return a signed JWT.
 */
export const login = async ({ email, password }) => {
  // Find user including password for comparison
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Return token with safe user fields
  const safeUser = { ...user };
  delete safeUser.password;
  const token = signToken(safeUser.id);
  return { user: safeUser, token };
};

/**
 * Get the current authenticated user's profile.
 */
export const getProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError('User not found.', 404);
  return user;
};
