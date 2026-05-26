import type { ZovaSys } from 'zova';

import { scrollBehavior } from '../lib/utils.js';

export const config = (_sys: ZovaSys) => {
  return {
    scrollBehavior,
  };
};
