import type { EntityOrder } from '../entity/order.tsx';

export const orderSummaryColumns = [
  'id',
  'state',
  'currency',
  'payableTotalCents',
  'createdAt',
] satisfies Array<keyof EntityOrder>;
