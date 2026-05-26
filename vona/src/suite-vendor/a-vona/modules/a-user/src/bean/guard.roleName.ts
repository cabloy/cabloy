import type { Next } from 'vona';
import type { IDecoratorGuardOptions, IGuardExecute } from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { Guard } from 'vona-module-a-aspect';

import type { IRoleNameRecord } from '../types/role.ts';

export interface IGuardOptionsRoleName extends IDecoratorGuardOptions {
  name?: keyof IRoleNameRecord | (keyof IRoleNameRecord)[];
  passWhenMatched: boolean;
  rejectWhenDismatched: boolean;
}

@Guard<IGuardOptionsRoleName>({
  passWhenMatched: true,
  rejectWhenDismatched: true,
})
export class GuardRoleName extends BeanBase implements IGuardExecute {
  async execute(options: IGuardOptionsRoleName, next: Next): Promise<boolean> {
    const result = await this._check(options);
    if (!result) {
      if (options.rejectWhenDismatched) return this.app.throw(403);
    } else {
      if (options.passWhenMatched) return true;
    }
    // next
    return next();
  }

  private async _check(options: IGuardOptionsRoleName) {
    if (!options.name) return false;
    return this.bean.passport.checkRoleName(options.name);
  }
}
