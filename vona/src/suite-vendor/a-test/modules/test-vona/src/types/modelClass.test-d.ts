import type { Constructable } from 'vona';
import type { prepareClassModel } from 'vona-module-a-orm';

import type { ModelUser } from '../model/user.ts';

type Assert<T extends true> = T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type NamedModelConstructor = Assert<
  Same<ReturnType<typeof prepareClassModel<'test-vona:user'>>, Constructable<ModelUser>>
>;
export type DirectModelConstructor = Assert<
  Same<ReturnType<typeof prepareClassModel<ModelUser>>, Constructable<ModelUser>>
>;
