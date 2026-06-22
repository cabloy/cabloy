import type {
  ICommandExecute,
  ICommandDetailOptionsBase,
  NextCommandExecute,
} from 'zova-module-a-command';
import type { IJsxRenderContextBase, IJsxRenderContextDetails } from 'zova-module-a-openapi';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { isNil } from '@cabloy/utils';
import { BeanBase } from 'zova';
import { Command } from 'zova-module-a-command';

export type TypeCommandDeleteResult = unknown;

export interface ICommandOptionsDelete extends ICommandDetailOptionsBase<TypeCommandDeleteResult> {}

type DetailItem = Record<string, any>;

@Command<ICommandOptionsDelete>()
export class CommandDelete extends BeanBase implements ICommandExecute {
  execute(
    _options: ICommandOptionsDelete,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    const { $celScope } = renderContext as IJsxRenderContextDetails;
    const $$details = $celScope.$$details;
    if (!$$details) throw new Error('should provide $$details in cell scope');
    const { cellContext } = renderContext as IJsxRenderContextTableCell;
    const row = cellContext?.row;
    if (!row) throw new Error('should provide row in cell context');
    const detailItem = row.original as DetailItem;
    const detailItemIndex = row.index;
    const detailItemId = detailItem.id;
    const detailItems = $$details.data as DetailItem[];
    if (!isNil(detailItemId)) {
      $$details.data = detailItems.map(item => {
        return item.id === detailItemId ? { ...item, deleted: true } : item;
      });
    } else {
      $$details.data = detailItems.filter((_item, index) => {
        return index !== detailItemIndex;
      });
    }
    return next();
  }
}
