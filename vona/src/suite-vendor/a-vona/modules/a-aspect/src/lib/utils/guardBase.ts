import type { Next } from 'vona';

import { BeanBase } from 'vona';

import type { IDecoratorGuardOptions, IGuardExecute } from '../../types/guard.ts';

export class GuardBase extends BeanBase implements IGuardExecute {
  async execute(options: IDecoratorGuardOptions, next: Next): Promise<boolean> {
    const result = await this.check(options);
    if (!result) {
      if (options.rejectWhenDismatched !== false) return this.app.throw(403);
    } else {
      if (options.passWhenMatched !== false) return true;
    }
    // next
    return next();
  }

  async check(_options: IDecoratorGuardOptions): Promise<boolean> {
    throw new Error('Not Implemented');
  }
}
