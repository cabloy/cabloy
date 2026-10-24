import { createBeanDecorator } from 'zova';

import type { IDecoratorTableCellOptions } from '../types/tableCell.ts';

export function TableCell<T extends IDecoratorTableCellOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('tableCell', 'app', true, options);
}
