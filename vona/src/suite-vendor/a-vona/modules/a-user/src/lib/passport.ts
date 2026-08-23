import type { IGuardOptionsRbac } from 'vona-module-a-rbac';

import { Aspect } from 'vona-module-a-aspect';

import type { IGuardOptionsRoleName } from '../bean/guard.roleName.ts';

export type TypePassportActivated = boolean | 'noCheck';

function Public(_public: boolean = true): ClassDecorator & MethodDecorator {
  return Aspect.guardGlobal('a-user:passport', { public: _public });
}

function Activated(activated: TypePassportActivated): ClassDecorator & MethodDecorator {
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

function Rbac(options?: Partial<IGuardOptionsRbac>): MethodDecorator {
  const decorator = Aspect.guard('a-rbac:rbac', { ...options });
  return (target, propertyKey, descriptor) => {
    if (propertyKey === undefined) {
      throw new Error('Passport.rbac must decorate an action');
    }
    return decorator(target, propertyKey, descriptor);
  };
}

export interface IDecoratorGroupPassport {
  public: typeof Public;
  activated: typeof Activated;
  roleName: typeof RoleName;
  systemAdmin: typeof SystemAdmin;
  rbac: typeof Rbac;
}

export const Passport: IDecoratorGroupPassport = {
  public: Public,
  activated: Activated,
  roleName: RoleName,
  systemAdmin: SystemAdmin,
  rbac: Rbac,
} as unknown as IDecoratorGroupPassport;
