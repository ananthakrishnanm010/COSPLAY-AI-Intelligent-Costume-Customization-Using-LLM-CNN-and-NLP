import prisma from '../config/prismaClient.js';

/**
 * Find a user by their email address.
 */
export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

/**
 * Find a user by their ID, returning only safe public fields.
 */
export const findUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

/**
 * Create a new user record.
 */
export const createUser = (data) =>
  prisma.user.create({
    data,
    select: { id: true, email: true, name: true, role: true },
  });
