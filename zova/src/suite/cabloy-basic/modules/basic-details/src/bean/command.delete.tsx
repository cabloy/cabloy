import type {
  ICommandExecute,
  ICommandDetailOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';

export type TypeCommandDeleteResult = unknown;

export interface ICommandOptionsDelete extends ICommandDetailOptionsBase<TypeCommandDeleteResult> {}

@Command<ICommandOptionsDelete>()
export class CommandDelete extends BeanBase implements ICommandExecute {
  execute(
    _options: ICommandOptionsDelete,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    console.log(_options, _renderContext);
    return next();
  }
}
