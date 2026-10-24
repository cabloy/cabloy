import type { CssBase } from '../bean/css.base.ts';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $cssBase: CssBase;
  }
}
