import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import * as invoiceController from './invoice.controller.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getOne);
router.post('/generate/:orderId', invoiceController.generate);
router.delete('/:id', invoiceController.remove);

export default router;
