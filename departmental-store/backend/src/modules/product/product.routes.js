import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productQuerySchema,
} from './product.validation.js';
import * as productController from './product.controller.js';

const router = Router();

router.get('/', validate(productQuerySchema), productController.getAll);
router.get('/:id', validate(productIdSchema), productController.getOne);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(createProductSchema),
  productController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(productIdSchema),
  productController.remove
);

export default router;
