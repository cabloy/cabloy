import { BeanBase } from 'zova';
import {
  Command,
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import { IJsxRenderContextBase } from 'zova-module-a-openapi';

export type TypeCommandCopyResult = unknown;

export interface ICommandOptionsCopy extends ICommandOptionsBase<TypeCommandCopyResult> {
  text: any;
}

@Command<ICommandOptionsCopy>()
export class CommandCopy extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsCopy,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const res = navigator.clipboard.writeText(options.text);
    return next(res);
  }
}
