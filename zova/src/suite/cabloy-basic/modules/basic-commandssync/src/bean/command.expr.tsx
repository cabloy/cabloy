import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { BeanBase, Preload } from 'zova';
import {
  Command,
  type ICommandExecute,
  type ICommandOptionsBase,
  type NextCommandExecute,
} from 'zova-module-a-command';

export type TypeCommandExprResult = unknown;

export interface ICommandOptionsExpr extends ICommandOptionsBase<TypeCommandExprResult> {
  expression: string;
}

@Command<ICommandOptionsExpr>()
@Preload()
export class CommandExpr extends BeanBase implements ICommandExecute {
  execute(
    options: ICommandOptionsExpr,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    return next(options.expression);
  }
}
