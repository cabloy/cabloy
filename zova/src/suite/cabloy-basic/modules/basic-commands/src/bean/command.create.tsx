import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import {
  BeanCommandBulkBase,
  Command,
  type ICommandBulkOptionsBase,
  type ICommandExecute,
  type NextCommandExecute,
} from 'zova-module-a-command';

export type TypeCommandCreateResult = unknown;

export interface ICommandOptionsCreate extends ICommandBulkOptionsBase<TypeCommandCreateResult> {
  replace?: boolean;
}

@Command<ICommandOptionsCreate>()
export class CommandCreate extends BeanCommandBulkBase implements ICommandExecute {
  execute(
    options: ICommandOptionsCreate,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { resource } = this.getResource(options, renderContext);
    const { $host } = renderContext;
    const url = $host.$router.getPagePath('/rest/resource/:resource/create', {
      params: { resource },
    });
    if (options.replace) {
      $host.$router.replace(url);
    } else {
      $host.$router.push(url);
    }
    return next();
  }
}
