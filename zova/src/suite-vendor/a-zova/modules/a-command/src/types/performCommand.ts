import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import type { ICommandRecord, SymbolCommandResult } from './command.js';
import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $performCommand: <T extends keyof ICommandRecord>(
      commandName: T,
      options: Partial<ICommandRecord[T]> | undefined,
      renderContext?: IJsxRenderContextBase,
      next?: Function,
    ) => ICommandRecord[T][typeof SymbolCommandResult];
  }
}
