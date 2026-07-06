import { Router } from 'express';

import {
  createAddress,
  createCheckout,
  deleteAddress,
  getOrder,
  getPaymentConfig,
  listAddresses,
  updateAddress,
  verifyOrder,
} from '@/controllers/checkout.controller.js';
import { authenticate } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import {
  createAddressSchema,
  createCheckoutSchema,
  orderNumberParamSchema,
  updateAddressSchema,
} from '@/validators/checkout.validator.js';

export const checkoutRouter = Router();

checkoutRouter.use(authenticate);

checkoutRouter.get('/payment-config', getPaymentConfig);
checkoutRouter.post('/orders', validate({ body: createCheckoutSchema }), createCheckout);
checkoutRouter.get(
  '/orders/:orderNumber/verify',
  validate({ params: orderNumberParamSchema }),
  verifyOrder
);
checkoutRouter.get(
  '/orders/:orderNumber',
  validate({ params: orderNumberParamSchema }),
  getOrder
);

checkoutRouter.get('/addresses', listAddresses);
checkoutRouter.post('/addresses', validate({ body: createAddressSchema }), createAddress);
checkoutRouter.patch(
  '/addresses/:id',
  validate({ body: updateAddressSchema }),
  updateAddress
);
checkoutRouter.delete('/addresses/:id', deleteAddress);
