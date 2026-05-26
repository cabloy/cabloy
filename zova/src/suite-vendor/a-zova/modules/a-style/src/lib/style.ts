import { createBeanDecorator } from 'zova';

import type { IDecoratorCssOptions } from '../types/css.js';
import type { IDecoratorThemeOptions } from '../types/theme.js';

export function Css<T extends IDecoratorCssOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('css', 'app', true, options);
}

export function Theme<T extends IDecoratorThemeOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('theme', 'app', true, options);
}
