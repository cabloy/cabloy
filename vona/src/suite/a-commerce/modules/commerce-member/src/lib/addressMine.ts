import type { EntityAddress } from '../entity/address.tsx';

export const addressMineWriteColumns = [
  'recipientName',
  'phone',
  'countryCode',
  'region',
  'city',
  'postalCode',
  'addressLine1',
  'addressLine2',
] satisfies Array<keyof EntityAddress>;

export const addressMineReadColumns = ['id', ...addressMineWriteColumns] satisfies Array<
  keyof EntityAddress
>;
