import type { ICommandExecute, ICommandOptionsBase } from 'zova-module-a-command';
import type { NextCommandExecute } from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';
import type { IModalAlertOptions, IModalDialogOptions } from 'zova-module-basic-app';

import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';

export type TypeCommandAlertResult = unknown;

export interface ICommandOptionsAlert
  extends ICommandOptionsBase<TypeCommandAlertResult>, IModalAlertOptions {
  dialogOptions?: IModalDialogOptions;
}

@Command<ICommandOptionsAlert>()
export class CommandAlert extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsAlert,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $host } = renderContext;
    $host.$appModal.alert(options, options.dialogOptions);
    return next();
  }
}
