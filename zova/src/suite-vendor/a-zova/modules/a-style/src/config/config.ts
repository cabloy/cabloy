import type { ZovaSys } from 'zova';
import type { TypeMetaRecordSelectorSpecificNameKeys } from 'zova-module-a-meta';

import type { ICssRecord } from '../types/css.js';
import type { IThemeRecord } from '../types/theme.js';

export const config = (_sys: ZovaSys) => {
  return {
    defaultCss: 'home-theme:base' as keyof ICssRecord,
    defaultTheme: 'home-theme:default' as keyof IThemeRecord,
    defaultThemeHandler: '' as TypeMetaRecordSelectorSpecificNameKeys<'themeHandler'>,
    model: {
      themename: {
        persister: {
          maxAge: Infinity,
        },
      },
    },
  };
};
