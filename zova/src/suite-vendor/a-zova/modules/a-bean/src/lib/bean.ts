import { createBeanDecorator } from 'zova';

import type { IDecoratorAopOptions } from '../types/aop.js';
import type { IDecoratorAopMethodOptions } from '../types/aopMethod.js';

export function Sys(): ClassDecorator {
  return createBeanDecorator('sys', 'sys');
}

export function Bean(): ClassDecorator {
  return createBeanDecorator('bean', 'ctx');
}

export function Service(): ClassDecorator {
  return createBeanDecorator('service', 'ctx');
}

export function Tool(): ClassDecorator {
  return createBeanDecorator('tool', 'app');
}

export function Data(): ClassDecorator {
  return createBeanDecorator('data', 'new');
}

export function Controller(): ClassDecorator {
  return createBeanDecorator('controller', 'ctx');
}

export function Render(): ClassDecorator {
  return createBeanDecorator('render', 'ctx');
}

export function Style(): ClassDecorator {
  return createBeanDecorator('style', 'ctx');
}

export function Aop(options: IDecoratorAopOptions): ClassDecorator {
  return createBeanDecorator('aop', 'sys', true, options);
}

export function AopMethod<T extends IDecoratorAopMethodOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('aopMethod', 'sys', true, options);
}
