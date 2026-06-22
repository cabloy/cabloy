import type {
  ICommandExecute,
  ICommandRowOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';

import { BeanCommandRowBase, Command } from 'zova-module-a-command';
import { IJsxRenderContextDetails } from 'zova-module-a-openapi';

export type TypeCommandEditResult = unknown;

export interface ICommandOptionsEdit extends ICommandRowOptionsBase<TypeCommandEditResult> {}

@Command<ICommandOptionsEdit>()
export class CommandEdit extends BeanCommandRowBase implements ICommandExecute {
  execute(
    _options: ICommandOptionsEdit,
    renderContext: IJsxRenderContextDetails,
    next: NextCommandExecute,
  ) {
    const { $celScope } = renderContext;
    console.log(_options, $celScope.$$details!.data);
    return next();
  }
}
