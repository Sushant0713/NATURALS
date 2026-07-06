import type { Request, Response } from 'express';

import {
  createCheckoutOrder,
  getOrderByNumber,
  verifyCheckoutPayment,
} from '@/services/checkout.service.js';
import {
  createUserAddress,
  deleteUserAddress,
  listUserAddresses,
  updateUserAddress,
} from '@/services/address.service.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { sendSuccess } from '@/utils/api-response.js';
import { getCashfreeMode } from '@/services/cashfree.service.js';

export const createCheckout = asyncHandler(async (req: Request, res: Response) => {
  const result = await createCheckoutOrder(req.user!, req.body);
  return sendSuccess(res, result, undefined, 201);
});

export const verifyOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderNumber = String(req.params.orderNumber);
  const result = await verifyCheckoutPayment(req.user!.id, orderNumber);
  return sendSuccess(res, result);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderNumber = String(req.params.orderNumber);
  const result = await getOrderByNumber(req.user!.id, orderNumber);
  return sendSuccess(res, result);
});

export const getPaymentConfig = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, {
    provider: 'cashfree',
    mode: getCashfreeMode(),
  });
});

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await listUserAddresses(req.user!.id);
  return sendSuccess(res, addresses);
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await createUserAddress(req.user!.id, req.body);
  return sendSuccess(res, address, undefined, 201);
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await updateUserAddress(req.user!.id, String(req.params.id), req.body);
  return sendSuccess(res, address);
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  await deleteUserAddress(req.user!.id, String(req.params.id));
  return sendSuccess(res, null, 'Address deleted');
});
