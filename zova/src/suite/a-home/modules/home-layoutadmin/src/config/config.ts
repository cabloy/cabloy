import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    layout: {
      sidebar: {
        width: 300,
        bodyReadyObserver: true,
        breakpoint: 1023,
        leftOpenPCCapability: true,
        leftOpenPCFallback: true,
      },
      navbar: {
        height: 132,
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
