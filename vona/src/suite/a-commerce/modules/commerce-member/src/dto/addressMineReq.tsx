import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelAddress } from '../model/address.ts';

export const addressMineQuery = $defineQuery(() => ModelAddress, {
  name: 'CommerceAddressMine',
  fields: {},
  orderable: ['id', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsAddressMineReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineReq>({ query: addressMineQuery })
export class DtoAddressMineReq extends $Dto.queryPage(addressMineQuery, []) {}
