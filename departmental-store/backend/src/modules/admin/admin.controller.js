import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as adminService from './admin.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return success(res, stats, 'Dashboard stats fetched');
});

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await adminService.getCustomers();
  return success(res, customers, 'Customers fetched');
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await adminService.getCustomerById(req.params.id);
  return success(res, customer, 'Customer fetched');
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await adminService.createCustomer(req.body);
  return success(res, customer, 'Customer created', 201);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await adminService.updateCustomer(req.params.id, req.body);
  return success(res, customer, 'Customer updated');
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const result = await adminService.deleteCustomer(req.params.id);
  return success(res, result, 'Customer deleted');
});
