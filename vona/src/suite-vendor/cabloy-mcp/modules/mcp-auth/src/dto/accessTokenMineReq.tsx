import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { $defineQuery } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { ModelAuthorization } from '../model/authorization.ts';
import { DtoMcpSiteQuery } from './mcpSiteQuery.ts';

export const accessTokenMineQuery = $defineQuery(() => ModelAuthorization, {
  name: 'McpAccessTokenMine',
  fields: {},
  orderable: [],
  defaults: { orders: [{ field: 'id', direction: 'desc' }], pageNo: 1, pageSize: 20 },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsAccessTokenMineReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAccessTokenMineReq>()
export class DtoAccessTokenMineReq extends DtoMcpSiteQuery {
  @Api.field(z.number().int().min(1).max(1000000).default(1))
  pageNo: number;

  @Api.field(z.number().int().min(1).max(100).default(20))
  pageSize: number;
}
