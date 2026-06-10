import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as orderService from './order.service.js';

export const create = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  return success(res, order, 'Order placed successfully', 201);
});

export const getAll = asyncHandler(async (req, res) => {
  const filters = req.user.role === 'ADMIN' ? req.query : { userId: req.user.id, ...req.query };
  const orders = await orderService.getOrders(filters);
  return success(res, orders, 'Orders fetched');
});

export const getOne = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'ADMIN' ? null : req.user.id;
  const order = await orderService.getOrderById(req.params.id, userId);
  return success(res, order, 'Order fetched');
});

export const createAdmin = asyncHandler(async (req, res) => {
  const order = await orderService.createAdminOrder(req.body);
  return success(res, order, 'Order created successfully', 201);
});

export const update = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body);
  return success(res, order, 'Order updated');
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  return success(res, order, 'Order status updated');
});

export const remove = asyncHandler(async (req, res) => {
  const result = await orderService.deleteOrder(req.params.id);
  return success(res, result, 'Order deleted');
});
