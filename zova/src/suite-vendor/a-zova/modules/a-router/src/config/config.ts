import type { ZovaSys } from 'zova';

import { scrollBehavior } from '../lib/utils.ts';

export const config = (_sys: ZovaSys) => {
  return {
    scrollBehavior,
  };
};
