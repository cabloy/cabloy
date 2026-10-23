import type { ScopeModule } from '../.metadata/this.ts';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $scopeBase: ScopeModule;
  }
}
