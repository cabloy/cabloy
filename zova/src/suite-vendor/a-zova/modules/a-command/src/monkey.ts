import type { BeanBase, BeanContainer, IMonkeyBeanInit } from 'zova';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { BeanSimple, cast } from 'zova';

import type { ICommandRecord } from './types/command.js';

import { $performCommand } from './lib/performCommand.js';

export class Monkey extends BeanSimple implements IMonkeyBeanInit {
  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    const self = this;
    bean.defineProperty(beanInstance, '$performCommand', {
      enumerable: false,
      configurable: true,
      get() {
        return function <T extends keyof ICommandRecord>(
          commandName: T,
          options: Partial<ICommandRecord[T]> | undefined,
          renderContext?: IJsxRenderContextBase,
          next?: Function,
        ) {
          renderContext = Object.assign(
            {
              app: cast(beanInstance).app,
              ctx: cast(beanInstance).ctx,
              $host: beanInstance,
            },
            renderContext,
          );
          return $performCommand(self.sys, commandName, options, renderContext, next);
        };
      },
    });
  }
}
