import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as cartService from './cart.service.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return success(res, cart, 'Cart fetched');
});

export const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user.id, req.body);
  return success(res, cart, 'Item added to cart');
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(req.user.id, req.body);
  return success(res, cart, 'Cart updated');
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.id, req.body);
  return success(res, cart, 'Item removed from cart');
});

export const clear = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  return success(res, cart, 'Cart cleared');
});
