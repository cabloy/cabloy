import type { cssRaw, cssRule, style } from 'typestyle';

import type { BeanTheme } from '../bean/bean.theme.js';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $style: typeof style;
    $cssRule: typeof cssRule;
    $cssRaw: typeof cssRaw;
    $theme: BeanTheme;
    $cssMerge: (...args: any[]) => string;
  }
}
