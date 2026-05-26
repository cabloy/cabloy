import type { ZovaSys } from 'zova';
import type { IServiceRecord } from 'zova-module-a-bean';

export const config = (_sys: ZovaSys) => {
  return {
    jwtAdapter: 'home-api:jwtAdapter' as keyof IServiceRecord,
    authToken: {
      default: true,
    },
  };
};
