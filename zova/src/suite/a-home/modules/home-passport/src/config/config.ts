import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    accessToken: {
      expireTimeDelay: 2 * 60,
    },
  };
};
