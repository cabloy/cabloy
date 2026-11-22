import type { IDecoratorGuardOptions } from 'vona-module-a-aspect';

import { Guard, GuardBase } from 'vona-module-a-aspect';

export interface IGuardOptionsAiChatAccess extends IDecoratorGuardOptions {}

@Guard<IGuardOptionsAiChatAccess>({ passWhenMatched: false })
export class GuardAiChatAccess extends GuardBase {
  async check(): Promise<boolean> {
    const user = this.bean.passport.currentUser;
    const roles = user && (await this.bean.role.findAllByUserId(user.id));
    if (roles?.some(role => role.aiChatAccess === true)) return true;
    this.$logger.debug('ai.chat.access.denied');
    return false;
  }
}
