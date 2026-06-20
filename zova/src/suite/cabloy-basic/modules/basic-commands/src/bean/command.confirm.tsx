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
  async execute(
    options: ICommandOptionsConfirm,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const res = await this.$appModal.confirm({
      text: options.message,
    });
    return next(res);
  }
}
