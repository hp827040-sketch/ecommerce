import { asyncHandler } from '../../utils/asyncHandler.js';
import { success } from '../../utils/apiResponse.js';
import * as invoiceService from './invoice.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const invoices = await invoiceService.getInvoices();
  return success(res, invoices, 'Invoices fetched');
});

export const getOne = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  return success(res, invoice, 'Invoice fetched');
});

export const generate = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.generateInvoice(req.params.orderId);
  return success(res, invoice, 'Invoice generated', 201);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await invoiceService.deleteInvoice(req.params.id);
  return success(res, result, 'Invoice deleted');
});
