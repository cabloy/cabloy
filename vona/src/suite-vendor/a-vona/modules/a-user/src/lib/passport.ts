import { Aspect } from 'vona-module-a-aspect';

import type { IGuardOptionsRoleName } from '../bean/guard.roleName.ts';
import type { IGuardOptionsUserName } from '../bean/guard.userName.ts';

function Public(_public: boolean = true): ClassDecorator & MethodDecorator {
  return Aspect.guardGlobal('a-user:passport', { public: _public });
}

// true/false/undefined
function Activated(activated?: boolean): ClassDecorator & MethodDecorator {
  return Aspect.guardGlobal('a-user:passport', { activated });
}

function UserName(options?: Partial<IGuardOptionsUserName>): ClassDecorator & MethodDecorator {
  return Aspect.guard('a-user:userName', options);
}

function RoleName(options?: Partial<IGuardOptionsRoleName>): ClassDecorator & MethodDecorator {
  return Aspect.guard('a-user:roleName', options);
}

function Admin(
  options?: Partial<Omit<IGuardOptionsRoleName, 'name'>>,
): ClassDecorator & MethodDecorator {
  return Aspect.guard('a-user:roleName', Object.assign({}, options, { name: 'admin' as const }));
}

export interface IDecoratorGroupPassport {
  public: typeof Public;
  activated: typeof Activated;
  userName: typeof UserName;
  roleName: typeof RoleName;
  admin: typeof Admin;
}

export const Passport: IDecoratorGroupPassport = {
  public: Public,
  activated: Activated,
  userName: UserName,
  roleName: RoleName,
  admin: Admin,
} as unknown as IDecoratorGroupPassport;
