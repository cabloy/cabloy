import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoChatHistoryRequest } from './chatHistoryRequest.tsx';

export interface IDtoOptionsChatStatusRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatStatusRequest>()
export class DtoChatStatusRequest extends DtoChatHistoryRequest {
  @Api.field(
    v.required(),
    z
      .string()
      .min(1)
      .max(100)
      .regex(/^[\w-]+$/),
  )
  requestKey: string;
}
