import type { IMetaPrintTipExecute, TypeMetaPrintTipResult } from 'vona-module-a-printtip';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $apiPath } from 'vona-module-a-openapiutils';

@Meta()
export class MetaPrintTip extends BeanBase implements IMetaPrintTipExecute {
  async execute(): Promise<TypeMetaPrintTipResult> {
    // apiPath
    const _apiPathSwagger = this.app.util.getAbsoluteUrlByApiPath($apiPath('//swagger'));
    const _apiPathRapidoc = this.app.util.getAbsoluteUrlByApiPath($apiPath('//rapidoc'));
    return [
      { title: 'swagger', message: _apiPathSwagger },
      // { title: 'swagger30', path: `http://localhost:${app.meta.env.SERVER_LISTEN_PORT}${_apiPathSwagger}?version=V30` },
      { title: 'rapidoc', message: _apiPathRapidoc },
      // { title: 'rapidoc30', path: `http://localhost:${app.meta.env.SERVER_LISTEN_PORT}${_apiPathRapidoc}?version=V30` },
    ];
  }
}
