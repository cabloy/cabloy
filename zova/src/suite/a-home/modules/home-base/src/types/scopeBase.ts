import type { ScopeModule } from '../.metadata/this.js';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $scopeBase: ScopeModule;
  }
}
