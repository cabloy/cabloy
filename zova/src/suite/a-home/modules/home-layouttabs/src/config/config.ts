import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
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
