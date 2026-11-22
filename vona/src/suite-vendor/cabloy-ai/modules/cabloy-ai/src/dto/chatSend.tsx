import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoChatStatusRequest } from './chatStatusRequest.tsx';

export interface IDtoOptionsChatSend extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatSend>()
export class DtoChatSend extends DtoChatStatusRequest {
  @Api.field(v.required(), z.string().trim().min(1).max(32000))
  text: string;
}
