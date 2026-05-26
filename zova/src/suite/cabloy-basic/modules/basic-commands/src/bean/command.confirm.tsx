import { BeanBase } from 'zova';
import {
  Command,
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import { IJsxRenderContextBase } from 'zova-module-a-openapi';

export type TypeCommandConfirmResult = boolean;

export interface ICommandOptionsConfirm extends ICommandOptionsBase<TypeCommandConfirmResult> {
  message: string;
}

@Command<ICommandOptionsConfirm>()
export class CommandConfirm extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsConfirm,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    // eslint-disable-next-line no-alert
    const res = window.confirm(options.message);
    return next(res);
  }
}
