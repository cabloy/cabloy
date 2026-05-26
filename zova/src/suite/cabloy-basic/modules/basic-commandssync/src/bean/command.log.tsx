import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { BeanBase, Preload } from 'zova';
import {
  Command,
  type ICommandExecute,
  type ICommandOptionsBase,
  type NextCommandExecute,
} from 'zova-module-a-command';

export type TypeCommandLogResult = unknown;

export interface ICommandOptionsLog extends ICommandOptionsBase<TypeCommandLogResult> {
  name?: string;
  message: any;
}

@Command<ICommandOptionsLog>()
@Preload()
export class CommandLog extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsLog,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    if (process.env.CLIENT) {
      const name = options.name;
      const message = options.message;
      if (isNil(name)) {
        console.log(message);
      } else {
        console.log(name, message);
      }
    }
    return next();
  }
}
