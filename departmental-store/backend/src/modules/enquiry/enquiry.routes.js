import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createEnquirySchema, updateEnquirySchema, enquiryIdSchema } from './enquiry.validation.js';
import * as enquiryController from './enquiry.controller.js';

const router = Router();

router.post('/', validate(createEnquirySchema), enquiryController.create);
router.get('/', authenticate, authorize('ADMIN'), enquiryController.getAll);
router.patch('/:id/read', authenticate, authorize('ADMIN'), enquiryController.markRead);
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateEnquirySchema), enquiryController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), validate(enquiryIdSchema), enquiryController.remove);

export default router;
