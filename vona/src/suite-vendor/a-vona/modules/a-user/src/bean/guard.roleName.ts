import type { IDecoratorGuardOptions } from 'vona-module-a-aspect';

import { Guard, GuardBase } from 'vona-module-a-aspect';

import type { IRoleNameRecord } from '../types/role.ts';

export interface IGuardOptionsRoleName extends IDecoratorGuardOptions {
  name?: keyof IRoleNameRecord | (keyof IRoleNameRecord)[];
}

@Guard<IGuardOptionsRoleName>()
export class GuardRoleName extends GuardBase {
  async check(options: IGuardOptionsRoleName): Promise<boolean> {
    if (!options.name) return false;
    return this.bean.passport.checkRoleName(options.name);
  }
}
