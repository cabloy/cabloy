import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelAddress } from '../model/address.ts';

export interface IDtoOptionsAddressCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressCreate>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create', 'edit'] },
            }),
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoAddressCreate extends $Dto.create(() => ModelAddress, {
  columns: [
    'recipientName',
    'phone',
    'countryCode',
    'region',
    'city',
    'postalCode',
    'addressLine1',
    'addressLine2',
  ],
}) {}
