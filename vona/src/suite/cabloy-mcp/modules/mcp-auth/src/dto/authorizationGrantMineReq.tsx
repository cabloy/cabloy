import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { $makeSchema } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { EntityAuthorization } from '../entity/authorization.tsx';

export interface IDtoOptionsAuthorizationGrantMineReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAuthorizationGrantMineReq>({
  fields: {
    pageNo: $makeSchema(z.number().int().min(1).max(1000000).default(1)),
    pageSize: $makeSchema(z.number().int().min(1).max(100).default(20)),
  },
})
export class DtoAuthorizationGrantMineReq extends $Class.pick(
  $Dto.queryPage(EntityAuthorization, []),
  ['pageNo', 'pageSize'],
) {}
