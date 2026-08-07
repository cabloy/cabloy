import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoOrderAdminLineBase } from './orderAdminLineBase.tsx';

export interface IDtoOptionsOrderAdminLineResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderAdminLineResItem>({
  blocks: [
    ZovaRender.block('basic-details:blockDetails', {
      blocks: [ZovaRender.block('basic-details:blockTable')],
    }),
  ],
})
export class DtoOrderAdminLineResItem extends DtoOrderAdminLineBase {}
