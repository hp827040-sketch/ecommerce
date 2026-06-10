import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as productService from './product.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const products = await productService.getProducts(req.query);
  return success(res, products, 'Products fetched');
});

export const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return success(res, product, 'Product fetched');
});

export const create = asyncHandler(async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const product = await productService.createProduct(req.body, image);
  return success(res, product, 'Product created', 201);
});

export const update = asyncHandler(async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const product = await productService.updateProduct(req.params.id, req.body, image);
  return success(res, product, 'Product updated');
});

export const remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return success(res, null, 'Product deleted');
});
