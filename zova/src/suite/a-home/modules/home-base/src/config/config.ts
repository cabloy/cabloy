import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        width: 300,
      },
      navbar: {
        height: 132,
      },
    },
  };
};
