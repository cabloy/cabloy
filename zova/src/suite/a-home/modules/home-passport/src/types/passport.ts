import type { ModelPassport } from '../model/passport.ts';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $passport: ModelPassport;
  }
}
