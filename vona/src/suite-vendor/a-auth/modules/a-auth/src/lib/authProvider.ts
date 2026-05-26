import { createBeanDecorator } from 'vona';

import type { IDecoratorAuthProviderOptions } from '../types/authProvider.ts';

export function AuthProvider<T extends IDecoratorAuthProviderOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('authProvider', options);
}
