import type { TableIdentity } from 'table-identity';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase, Use } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ApiSchemaCommerceTradeDtoOrderSelectResItem } from '../api/openapi/schemas.ts';
import type { ModelOrder } from '../model/order.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'commerce-trade:actionShip'?: ITableCellOptionsActionShip;
  }
}

export interface ITableCellOptionsActionShip extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionShip>({
  class: 'btn btn-outline btn-primary join-item',
})
export class TableCellActionShip extends BeanBase implements ITableCellRender {
  @Use({ beanFullName: 'commerce-trade.model.order' })
  $$modelOrder: ModelOrder;

  private async _ship(event: Event, orderId: TableIdentity) {
    const controls = (event.currentTarget as HTMLButtonElement).parentElement;
    const carrier = controls
      ?.querySelector<HTMLInputElement>('input[name="carrier"]')
      ?.value.trim();
    const trackingNumber = controls
      ?.querySelector<HTMLInputElement>('input[name="trackingNumber"]')
      ?.value.trim();
    const confirmed = controls?.querySelector<HTMLInputElement>('input[name="confirmed"]')?.checked;
    if (!carrier || !trackingNumber || !confirmed) return;
    await this.$$modelOrder.ship(orderId).mutateAsync({ carrier, trackingNumber });
  }

  render(
    options: ITableCellOptionsActionShip,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { cellContext } = renderContext;
    const order = cellContext.row.original as ApiSchemaCommerceTradeDtoOrderSelectResItem;
    const state = order.state;
    if (state !== 'paid') return;
    return (
      <div class="join">
        <input
          class="input input-bordered input-sm join-item w-32"
          name="carrier"
          placeholder="Carrier"
        />
        <input
          class="input input-bordered input-sm join-item w-36"
          name="trackingNumber"
          placeholder="Tracking number"
        />
        <label class="label cursor-pointer join-item gap-1 px-2">
          <input class="checkbox checkbox-sm" name="confirmed" type="checkbox" />
          <span class="label-text text-xs">Confirm</span>
        </label>
        <button
          class={options.class}
          type="button"
          onClick={event => this._ship(event, cellContext.row.id as TableIdentity)}
        >
          Ship order
        </button>
      </div>
    );
  }
}
