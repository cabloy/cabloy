import type { IBeanScopeRecord, ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    defaultModule: 'home-icon' as keyof IBeanScopeRecord,
  };
};
