import type { ZovaSys } from 'zova';

import { IFormProvider } from 'zova-module-a-openapi';

export const config = (_sys: ZovaSys) => {
  const formProvider: IFormProvider = {
    behaviors: {
      FormField: 'basic-form:formField',
      FormFieldLayout: 'basic-form:formFieldLayout',
    },
    components: {
      Input: 'basic-input:formFieldInput',
    },
  };
  return {
    formProvider,
  };
};
