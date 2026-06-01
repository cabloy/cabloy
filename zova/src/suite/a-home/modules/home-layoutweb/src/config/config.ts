import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        width: 360,
      },
      navbar: {
        height: 64,
      },
    },
    tabs: {
      scene: 'web',
      max: 6,
      maxItems: 6,
      cache: false,
    },
  };
};
