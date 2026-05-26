import type { ZovaSys } from 'zova';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { beanFullNameFromOnionName, deepExtend } from 'zova';

import type { ICommandRecord, SymbolCommandResult } from '../types/command.js';

export function $performCommand<T extends keyof ICommandRecord>(
  sys: ZovaSys,
  commandName: T,
  options: Partial<ICommandRecord[T]> | undefined,
  renderContext: IJsxRenderContextBase,
  next?: Function,
): ICommandRecord[T][typeof SymbolCommandResult] {
  if (!next) {
    next = commandRes => {
      return commandRes;
    };
  }
  // command
  const beanFullName = beanFullNameFromOnionName(commandName, 'command');
  const beanInstance = sys.bean._getBeanSyncOnly(beanFullName);
  if (beanInstance) {
    // sync
    return _renderEventCommandNormal_inner(beanInstance, options, renderContext, next);
  }
  // async
  return sys.bean._getBean(beanFullName, false).then(beanInstance => {
    return _renderEventCommandNormal_inner(beanInstance, options, renderContext, next);
  });
}

function _renderEventCommandNormal_inner(
  beanInstance: any,
  options: {} | undefined,
  renderContext: IJsxRenderContextBase,
  next?: Function,
) {
  const onionOptions = beanInstance.$onionOptions;
  // props
  const props = onionOptions ? deepExtend({}, onionOptions, options) : (options ?? {});
  return beanInstance.execute(props, renderContext, next);
}
