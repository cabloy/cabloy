import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsCategoryPublicSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategoryPublicSelectReq>()
export class DtoCategoryPublicSelectReq {
  @Api.field(z.number().int().min(1).default(1))
  pageNo: number;

  @Api.field(z.number().int().min(1).max(100).default(20))
  pageSize: number;
}
