import type { IModalConfirmOptions, IModalDialogOptions } from 'zova-module-basic-app';

import { BeanBase } from 'zova';
import {
  Command,
  ICommandExecute,
  ICommandOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import { IJsxRenderContextBase } from 'zova-module-a-openapi';

export type TypeCommandConfirmResult = Promise<boolean>;

export interface ICommandOptionsConfirm
  extends ICommandOptionsBase<TypeCommandConfirmResult>, IModalConfirmOptions {
  dialogOptions?: IModalDialogOptions;
}

@Command<ICommandOptionsConfirm>()
export class CommandConfirm extends BeanBase implements ICommandExecute {
  async execute(
    options: ICommandOptionsConfirm,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $host } = renderContext;
    const res = await $host.$appModal.confirm(options, options.dialogOptions);
    return next(res);
  }
}
