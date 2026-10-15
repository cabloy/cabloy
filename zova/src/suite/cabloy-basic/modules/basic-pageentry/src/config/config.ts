import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    draft: {
      enabled: true,
      maxAge: 24 * 60 * 60 * 1000,
      resources: {} as Record<string, boolean>,
    },
  };
};
