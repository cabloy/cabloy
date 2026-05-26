import type { IBeanScopeRecord, ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    defaultModuleApi: 'home-api' as keyof IBeanScopeRecord,
  };
};
