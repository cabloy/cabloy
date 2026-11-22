import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoChatConversation } from './chatConversation.tsx';
import { DtoChatMessage } from './chatMessage.tsx';

export interface IDtoOptionsChatHistory extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatHistory>()
export class DtoChatHistory {
  @Api.field(v.required(), v.object(DtoChatConversation))
  conversation: DtoChatConversation;

  @Api.field(v.required(), v.array(DtoChatMessage))
  messages: DtoChatMessage[];
}
