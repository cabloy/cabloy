import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsMcpSiteQuery extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMcpSiteQuery>()
export class DtoMcpSiteQuery {
  @Api.field(z.string().min(1).max(255))
  ssrSiteId: string;
}
