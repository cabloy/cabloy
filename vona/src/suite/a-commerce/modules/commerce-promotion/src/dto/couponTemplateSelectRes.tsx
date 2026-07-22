import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoCouponTemplateSelectResItem } from './couponTemplateSelectResItem.tsx';

export interface IDtoOptionsCouponTemplateSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateSelectRes>()
export class DtoCouponTemplateSelectRes extends $Dto.listAndCount(DtoCouponTemplateSelectResItem) {}
