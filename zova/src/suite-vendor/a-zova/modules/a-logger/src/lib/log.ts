import { UseAopMethod } from 'zova-module-a-bean';

import type { IAopMethodOptionsLog } from '../bean/aopMethod.log.js';

export function Log(options?: Partial<IAopMethodOptionsLog>): MethodDecorator {
  return UseAopMethod('a-logger:log', options);
}
