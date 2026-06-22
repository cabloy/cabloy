import type {
  ICommandExecute,
  ICommandDetailOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextDetails } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';

export type TypeCommandDeleteResult = unknown;

export interface ICommandOptionsDelete extends ICommandDetailOptionsBase<TypeCommandDeleteResult> {}

@Command<ICommandOptionsDelete>()
export class CommandDelete extends BeanBase implements ICommandExecute {
  execute(
    _options: ICommandOptionsDelete,
    renderContext: IJsxRenderContextDetails,
    next: NextCommandExecute,
  ) {
    const { $celScope } = renderContext;
    console.log(_options, $celScope.$$details!.data);
    return next();
  }
}
