import type { IMetaRuntimeExecute } from 'vona-module-a-runtime';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

export type TypeMetaRuntimeResult = { accessToken?: string } | undefined;

@Meta()
export class MetaRuntime extends BeanBase implements IMetaRuntimeExecute {
  async execute(): Promise<TypeMetaRuntimeResult> {
    if (this.app.meta.isProd) return;
    // signin
    const jwt = await this.bean.passport.signinSystem('dev', '-1');
    const accessToken = jwt.accessToken;
    return {
      accessToken,
    };
  }
}
