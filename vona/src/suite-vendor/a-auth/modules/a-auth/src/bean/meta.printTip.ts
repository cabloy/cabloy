import type { IMetaPrintTipExecute, TypeMetaPrintTipResult } from 'vona-module-a-printtip';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $apiPath } from 'vona-module-a-openapiutils';

@Meta()
export class MetaPrintTip extends BeanBase implements IMetaPrintTipExecute {
  async execute(): Promise<TypeMetaPrintTipResult> {
    return {
      title: 'passport callback',
      message: this.app.util.getAbsoluteUrlByApiPath($apiPath('/auth/passport/callback')),
    };
  }
}
