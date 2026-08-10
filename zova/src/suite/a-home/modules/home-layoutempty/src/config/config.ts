import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        bodyReadyObserver: false,
        leftOpenPCCapability: false,
      },
    },
  };
};
