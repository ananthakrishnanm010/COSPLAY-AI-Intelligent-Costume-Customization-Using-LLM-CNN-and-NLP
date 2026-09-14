import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';

/**
 * POST /api/v1/auth/register
 */
export const registerHandler = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

/**
 * POST /api/v1/auth/login
 */
export const loginHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

/**
 * GET /api/v1/auth/me
 * Protected — requires valid JWT
 */
export const getMeHandler = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
