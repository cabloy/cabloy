import { BeanBase, cast } from 'zova';

import type { ScopeModule } from '../../.metadata/this.ts';
import type { IDecoratorModelOptions } from '../../types/model.ts';
import type { BeanModelBase } from '../bean.modelBase.ts';

import { __ThisModule__ } from '../../.metadata/this.ts';

export class BeanModelLast extends BeanBase {
  public selector: string;

  constructor(selector?: unknown) {
    super();
    if (this.$onionOptions?.enableSelector) {
      this.selector = (selector as string) ?? '';
    }
  }

  protected async __init__(_selector?: unknown) {
    // do nothing
  }

  public get $onionOptions(): IDecoratorModelOptions | undefined {
    return super.$onionOptions as IDecoratorModelOptions | undefined;
  }

  get self() {
    return cast<BeanModelBase>(this);
  }

  get scopeSelf(): ScopeModule {
    return this.bean.scope(__ThisModule__);
  }
}
