import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as enquiryService from './enquiry.service.js';

export const create = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body);
  return success(res, enquiry, 'Enquiry submitted successfully', 201);
});

export const getAll = asyncHandler(async (req, res) => {
  const enquiries = await enquiryService.getEnquiries(req.query);
  return success(res, enquiries, 'Enquiries fetched');
});

export const markRead = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.markAsRead(req.params.id);
  return success(res, enquiry, 'Enquiry marked as read');
});

export const update = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.updateEnquiry(req.params.id, req.body);
  return success(res, enquiry, 'Enquiry updated');
});

export const remove = asyncHandler(async (req, res) => {
  const result = await enquiryService.deleteEnquiry(req.params.id);
  return success(res, result, 'Enquiry deleted');
});
