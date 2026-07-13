import { Aspect } from 'vona-module-a-aspect';

import type { IGuardOptionsRoleName } from '../bean/guard.roleName.ts';

function Public(_public: boolean = true): ClassDecorator & MethodDecorator {
  return Aspect.guardGlobal('a-user:passport', { public: _public });
}

// true/false/undefined
function Activated(activated?: boolean): ClassDecorator & MethodDecorator {
  return Aspect.guardGlobal('a-user:passport', { activated });
}

function RoleName(options?: Partial<IGuardOptionsRoleName>): ClassDecorator & MethodDecorator {
  return Aspect.guard('a-user:roleName', options);
}

function SystemAdmin(
  options?: Partial<Omit<IGuardOptionsRoleName, 'name'>>,
): ClassDecorator & MethodDecorator {
  return Aspect.guard(
    'a-user:roleName',
    Object.assign({}, options, { name: 'systemAdmin' as const }),
  );
}

export interface IDecoratorGroupPassport {
  public: typeof Public;
  activated: typeof Activated;
  roleName: typeof RoleName;
  systemAdmin: typeof SystemAdmin;
}

export const Passport: IDecoratorGroupPassport = {
  public: Public,
  activated: Activated,
  roleName: RoleName,
  systemAdmin: SystemAdmin,
} as unknown as IDecoratorGroupPassport;
