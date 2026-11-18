import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsChatCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatCreate>()
export class DtoChatCreate {
  @Api.field(v.optional(), z.string().trim().max(120))
  title?: string;
}
