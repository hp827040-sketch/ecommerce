import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  addToCartSchema,
  updateCartSchema,
  removeFromCartSchema,
} from './cart.validation.js';
import * as cartController from './cart.controller.js';

const router = Router();

router.use(authenticate, authorize('CUSTOMER'));

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addItem);
router.put('/', validate(updateCartSchema), cartController.updateItem);
router.delete('/', validate(removeFromCartSchema), cartController.removeItem);
router.delete('/clear', cartController.clear);

export default router;
