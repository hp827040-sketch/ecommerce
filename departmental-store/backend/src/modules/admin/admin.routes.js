import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdSchema,
} from './admin.validation.js';
import * as adminController from './admin.controller.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/customers', adminController.getCustomers);
router.post('/customers', validate(createCustomerSchema), adminController.createCustomer);
router.get('/customers/:id', validate(customerIdSchema), adminController.getCustomer);
router.put('/customers/:id', validate(updateCustomerSchema), adminController.updateCustomer);
router.delete('/customers/:id', validate(customerIdSchema), adminController.deleteCustomer);

export default router;
