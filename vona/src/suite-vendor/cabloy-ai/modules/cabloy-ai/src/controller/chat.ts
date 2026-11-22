import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Aspect } from 'vona-module-a-aspect';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoChatConversation } from '../dto/chatConversation.tsx';
import { DtoChatCreate } from '../dto/chatCreate.tsx';
import { DtoChatHistory } from '../dto/chatHistory.tsx';
import { DtoChatHistoryRequest } from '../dto/chatHistoryRequest.tsx';
import { DtoChatList } from '../dto/chatList.tsx';
import { DtoChatPin } from '../dto/chatPin.tsx';
import { DtoChatRename } from '../dto/chatRename.tsx';
import { DtoChatRun } from '../dto/chatRun.tsx';
import { DtoChatSend } from '../dto/chatSend.tsx';
import { DtoChatStatusRequest } from '../dto/chatStatusRequest.tsx';

export interface IControllerOptionsChat extends IDecoratorControllerOptions {}

// Ordinary Passport authentication remains enabled. Owner identity never comes from the body.
@Controller<IControllerOptionsChat>('chat')
@Aspect.guard('cabloy-ai:aiChatAccess')
export class ControllerChat extends BeanBase {
  @Web.post('create')
  @Api.body(DtoChatConversation)
  async create(
    @Arg.user() user: IUser,
    @Arg.body() command: DtoChatCreate,
  ): Promise<DtoChatConversation> {
    return await this.scope.service.conversation.create(user.id, command);
  }

  @Web.post('list')
  @Api.body(v.array(DtoChatConversation))
  async list(
    @Arg.user() user: IUser,
    @Arg.body() command: DtoChatList,
  ): Promise<DtoChatConversation[]> {
    return await this.scope.service.conversation.list(user.id, command.ssrSiteId);
  }

  @Web.post('history')
  @Api.body(DtoChatHistory)
  async history(
    @Arg.user() user: IUser,
    @Arg.body() command: DtoChatHistoryRequest,
  ): Promise<DtoChatHistory> {
    return await this.scope.service.conversation.history(
      user.id,
      command.ssrSiteId,
      command.conversationId,
    );
  }

  @Web.post('status')
  @Api.body(v.object(DtoChatRun), v.nullable())
  async status(
    @Arg.user() user: IUser,
    @Arg.body() command: DtoChatStatusRequest,
  ): Promise<DtoChatRun | null> {
    return await this.scope.service.run.status(user.id, command);
  }

  @Web.post('remove')
  @Api.body(z.null())
  async remove(@Arg.user() user: IUser, @Arg.body() command: DtoChatHistoryRequest): Promise<void> {
    await this.scope.service.conversation.remove(
      user.id,
      command.ssrSiteId,
      command.conversationId,
    );
  }

  @Web.post('rename')
  @Api.body(DtoChatConversation)
  async rename(
    @Arg.user() user: IUser,
    @Arg.body() command: DtoChatRename,
  ): Promise<DtoChatConversation> {
    return await this.scope.service.conversation.rename(user.id, command);
  }

  @Web.post('pin')
  @Api.body(DtoChatConversation)
  async pin(
    @Arg.user() user: IUser,
    @Arg.body() command: DtoChatPin,
  ): Promise<DtoChatConversation> {
    return await this.scope.service.conversation.pin(user.id, command);
  }

  /** Native AI SDK UI Message Stream (text/event-stream), not a wrapped JSON result. */
  @Web.post('send')
  @Api.contentType('text/event-stream')
  @Api.bodyCustom(false, z.string())
  async send(@Arg.user() user: IUser, @Arg.body() command: DtoChatSend): Promise<void> {
    await this.scope.service.run.send(user.id, command);
  }
}
