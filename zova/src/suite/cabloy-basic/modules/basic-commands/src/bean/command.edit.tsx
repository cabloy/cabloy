import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import {
  BeanCommandRowBase,
  Command,
  type ICommandExecute,
  type ICommandRowOptionsBase,
  type NextCommandExecute,
} from 'zova-module-a-command';

export type TypeCommandEditResult = unknown;

export interface ICommandOptionsEdit extends ICommandRowOptionsBase<TypeCommandEditResult> {
  replace?: boolean;
}

@Command<ICommandOptionsEdit>()
export class CommandEdit extends BeanCommandRowBase implements ICommandExecute {
  execute(
    options: ICommandOptionsEdit,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { resource, id } = this.getResourceAndId(options, renderContext);
    const { $host } = renderContext;
    const url = $host.$router.getPagePath('/rest/resource/:resource/:id/:formScene?', {
      params: { resource, id: id.toString(), formScene: 'edit' },
    });
    if (options.replace) {
      $host.$router.replace(url);
    } else {
      $host.$router.push(url);
    }
    return next();
  }
}
