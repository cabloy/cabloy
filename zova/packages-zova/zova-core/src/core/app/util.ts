import type { ZodLocaleErrors } from '../../utils/zod-enhance.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { zodSetLocaleErrors } from '../../utils/zod-enhance.ts';

export class AppUtil extends BeanSimple {
  setLocaleErrors(localeErrors: ZodLocaleErrors, localeDefault?: string) {
    return zodSetLocaleErrors(this.app, localeErrors, localeDefault);
  }
}
