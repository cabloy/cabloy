import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityAddress } from '../entity/address.tsx';

export interface IDtoOptionsAddressSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressSelectReq>({
  openapi: { filter: { table: 'commerceMemberAddress' } },
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
export class DtoAddressSelectReq extends $Dto.queryPage(EntityAddress, [
  'recipientName',
  'phone',
  'createdAt',
]) {}
