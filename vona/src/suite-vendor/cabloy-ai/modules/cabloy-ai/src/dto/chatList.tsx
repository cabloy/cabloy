import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsChatList extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatList>()
export class DtoChatList {
  @Api.field(v.required(), z.string().trim().min(1).max(255))
  ssrSiteId: string;
}
