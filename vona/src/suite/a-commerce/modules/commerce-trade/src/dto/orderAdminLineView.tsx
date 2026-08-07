import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoOrderAdminLineBase } from './orderAdminLineBase.tsx';

export interface IDtoOptionsOrderAdminLineView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderAdminLineView>({
  blocks: [ZovaRender.block('basic-details:blockForm')],
})
export class DtoOrderAdminLineView extends DtoOrderAdminLineBase {}
