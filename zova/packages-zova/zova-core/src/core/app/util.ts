import type { ZodLocaleErrors } from '../../utils/zod-enhance.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { zodSetLocaleErrors } from '../../utils/zod-enhance.ts';

export class AppUtil extends BeanSimple {
  setLocaleErrors(localeErrors: ZodLocaleErrors, localeDefault?: string) {
    return zodSetLocaleErrors(this.app, localeErrors, localeDefault);
  }

  apiActionPathTranslate(pathName: string, pathParams?: Record<string, any>): string {
    if (pathParams?.locale === true) {
      const locale =
        this.app.meta.locale.current === this.sys.config.locale.default
          ? undefined
          : this.app.meta.locale.current;
      pathParams = Object.assign({}, pathParams, { locale });
    }
    return this.sys.util.apiActionPathTranslate(pathName, pathParams);
  }
}
