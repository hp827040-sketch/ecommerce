import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return success(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return success(res, result, 'Login successful');
});

export const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  return success(res, profile, 'Profile fetched');
});
