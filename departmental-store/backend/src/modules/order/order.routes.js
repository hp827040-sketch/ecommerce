import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createOrderSchema,
  createAdminOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
} from './order.validation.js';
import * as orderController from './order.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('CUSTOMER'), validate(createOrderSchema), orderController.create);
router.post(
  '/admin',
  authorize('ADMIN'),
  validate(createAdminOrderSchema),
  orderController.createAdmin
);
router.get('/', orderController.getAll);
router.get('/:id', validate(orderIdSchema), orderController.getOne);
router.put(
  '/:id',
  authorize('ADMIN'),
  validate(updateOrderSchema),
  orderController.update
);
router.put(
  '/:id/status',
  authorize('ADMIN'),
  validate(updateOrderStatusSchema),
  orderController.updateStatus
);
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(orderIdSchema),
  orderController.remove
);

export default router;
