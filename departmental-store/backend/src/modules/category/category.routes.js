import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from './category.validation.js';
import * as categoryController from './category.controller.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', validate(categoryIdSchema), categoryController.getOne);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(createCategorySchema),
  categoryController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(categoryIdSchema),
  categoryController.remove
);

export default router;
