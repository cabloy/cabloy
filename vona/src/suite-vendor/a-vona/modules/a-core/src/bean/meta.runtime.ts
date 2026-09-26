import type { IMetaRuntimeExecute } from 'vona-module-a-runtime';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

export interface TypeMetaRuntimeResult {
  protocol: string;
  host: string;
}

@Meta()
export class MetaRuntime extends BeanBase implements IMetaRuntimeExecute {
  async execute(): Promise<TypeMetaRuntimeResult> {
    return {
      protocol: this.app.util.protocol,
      host: this.app.util.host,
    };
  }
}
