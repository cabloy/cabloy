import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsStudentLookupReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentLookupReq>()
export class DtoStudentLookupReq {
  @Api.field(z.string().trim().min(1).max(100))
  name: string;

  @Api.field(z.number().int().min(1).max(3).optional())
  level?: 1 | 2 | 3;

  @Api.field(z.number().int().min(1).default(1))
  pageNo: number;

  @Api.field(z.number().int().min(1).max(20).default(10))
  pageSize: number;
}
