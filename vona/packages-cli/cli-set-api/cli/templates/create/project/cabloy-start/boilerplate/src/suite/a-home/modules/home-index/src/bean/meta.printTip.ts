import type { IMetaPrintTipExecute, TypeMetaPrintTipResult } from 'vona-module-a-printtip';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaPrintTip extends BeanBase implements IMetaPrintTipExecute {
  async execute(): Promise<TypeMetaPrintTipResult> {
    return {
      title: 'home',
      message: this.bean.core.getAbsoluteUrl(),
    };
  }
}
