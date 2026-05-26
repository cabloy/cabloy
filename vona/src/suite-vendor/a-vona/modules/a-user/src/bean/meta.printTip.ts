import type { IMetaPrintTipExecute, TypeMetaPrintTipResult } from 'vona-module-a-printtip';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaPrintTip extends BeanBase implements IMetaPrintTipExecute {
  async execute(): Promise<TypeMetaPrintTipResult> {
    if (!this.app.meta.isDev) return;
    // signin
    const jwt = await this.bean.passport.signinSystem('dev', '-1');
    const accessToken = jwt.accessToken;
    return {
      title: 'access token [admin] [dev]',
      message: `Bearer ${accessToken}`,
    };
  }
}
