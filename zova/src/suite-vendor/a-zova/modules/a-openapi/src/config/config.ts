import type { ZovaSys } from 'zova';

import { IFormProvider } from '../types/formProvider.ts';

export const config = (_sys: ZovaSys) => {
  return {
    formProvider: {} as IFormProvider,
    api: {
      bootstrap: '/api/openapischema/resource/bootstrap/:resource',
      permissions: '/api/home/base/permission/:resource',
    },
  };
};
