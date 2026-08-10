import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        bodyReadyObserver: true,
        breakpoint: 1023,
        leftOpenPCCapability: true,
        leftOpenPCFallback: true,
      },
    },
    tabs: {
      scene: '',
      max: 6,
      maxItems: 3,
      cache: true,
    },
    tabItem: {
      maxWidth: '130px',
    },
  };
};
