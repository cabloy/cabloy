import type { ModelPassport } from '../model/passport.js';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $passport: ModelPassport;
  }
}
