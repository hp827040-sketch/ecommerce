import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as customerService from './customer.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await customerService.getDashboard(req.user.id);
  return success(res, dashboard, 'Dashboard fetched');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await customerService.updateProfile(req.user.id, req.body);
  return success(res, profile, 'Profile updated');
});
