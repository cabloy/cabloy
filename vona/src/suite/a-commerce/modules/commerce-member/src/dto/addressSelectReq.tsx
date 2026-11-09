import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelAddress } from '../model/address.ts';

export const addressQuery = $defineQuery(() => ModelAddress, {
  name: 'CommerceAddressSelect',
  fields: {
    recipientName: { operators: ['eq', 'containsI'] },
    phone: { operators: ['eq', 'containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'recipientName', 'phone', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsAddressSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressSelectReq>({
  query: addressQuery,
  fields: {
    recipientName: $makeSchema(v.optional(), z.string()),
    phone: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoAddressSelectReq extends $Dto.queryPage(addressQuery, [
  'recipientName',
  'phone',
  'createdAt',
]) {}
