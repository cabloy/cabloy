import type { ICommandExecute, ICommandOptionsBase } from 'zova-module-a-command';
import type { NextCommandExecute } from 'zova-module-a-command';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';

export type TypeCommandAlertResult = unknown;

export interface ICommandOptionsAlert extends ICommandOptionsBase<TypeCommandAlertResult> {
  message: string;
  wait?: boolean;
}

@Command<ICommandOptionsAlert>({ wait: true })
export class CommandAlert extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsAlert,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    if (options.wait) {
      // eslint-disable-next-line no-alert
      window.alert(options.message);
    } else {
      setTimeout(() => {
        // eslint-disable-next-line no-alert
        window.alert(options.message);
      }, 0);
    }
    return next();
  }
}
