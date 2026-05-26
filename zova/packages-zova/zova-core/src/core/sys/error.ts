import type { TypeModuleResourceErrorModules } from '../../types/interface/module.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';

export class SysError extends BeanSimple {
  /** @internal */
  public errors: TypeModuleResourceErrorModules;

  /** @internal */
  public async initialize() {
    this.errors = {};
  }

  /** @internal */
  public dispose() {
    this.errors = {};
  }
}
