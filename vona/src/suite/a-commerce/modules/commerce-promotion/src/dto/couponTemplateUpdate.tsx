import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsCouponTemplateUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateUpdate>()
export class DtoCouponTemplateUpdate {
  @Api.field(v.optional(), v.min(2), v.max(100))
  name?: string;

  @Api.field(v.optional(), z.enum(['draft', 'active', 'disabled']))
  state?: 'draft' | 'active' | 'disabled';

  @Api.field(v.optional(), v.max(255))
  description?: string;
}
