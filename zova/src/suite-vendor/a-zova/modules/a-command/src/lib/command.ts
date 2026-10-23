import type { PowerPartial } from 'zova';

import { createBeanDecorator } from 'zova';

import type { IDecoratorCommandOptions } from '../types/command.ts';

export function Command<T extends IDecoratorCommandOptions>(
  options?: PowerPartial<T>,
): ClassDecorator {
  return createBeanDecorator('command', 'sys', true, options);
}
