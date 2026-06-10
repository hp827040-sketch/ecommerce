import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import * as customerController from './customer.controller.js';

const router = Router();

router.use(authenticate, authorize('CUSTOMER'));

router.get('/dashboard', customerController.getDashboard);
router.put('/profile', customerController.updateProfile);

export default router;
