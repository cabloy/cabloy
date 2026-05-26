import type { CssBase } from '../bean/css.base.js';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $cssBase: CssBase;
  }
}
