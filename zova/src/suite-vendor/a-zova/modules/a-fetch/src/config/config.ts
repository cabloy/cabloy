import type { CreateAxiosDefaults } from 'axios';
import type { ZovaSys } from 'zova';

export const config = (_sys: ZovaSys) => {
  return {
    axios: {
      config: {} as CreateAxiosDefaults,
    },
  };
};
