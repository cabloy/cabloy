import { createBeanDecorator } from 'zova';

import type { IDecoratorTableCellOptions } from '../types/tableCell.js';

export function TableCell<T extends IDecoratorTableCellOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('tableCell', 'sys', true, options);
}
