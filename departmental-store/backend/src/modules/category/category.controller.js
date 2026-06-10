import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as categoryService from './category.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.query);
  return success(res, categories, 'Categories fetched');
});

export const getOne = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return success(res, category, 'Category fetched');
});

export const create = asyncHandler(async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const category = await categoryService.createCategory(req.body, image);
  return success(res, category, 'Category created', 201);
});

export const update = asyncHandler(async (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const category = await categoryService.updateCategory(req.params.id, req.body, image);
  return success(res, category, 'Category updated');
});

export const remove = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return success(res, null, 'Category deleted');
});
