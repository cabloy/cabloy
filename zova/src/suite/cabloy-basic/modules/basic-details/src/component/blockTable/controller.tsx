import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase, IJsxRenderContextDetails } from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerTableBase } from 'zova-module-a-table';
import { ZTable } from 'zova-module-basic-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockTable'?: ControllerBlockTableProps;
  }
}

export interface ControllerBlockTableProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockTable<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {
    class: 'overflow-x-auto rounded-box border border-base-content/15 bg-base-100',
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: BeanControllerTableBase<TData>;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected async __init__() {}

  protected render() {
    const { $$details } = this.$$renderContext;
    const data = ($$details.data as TData[]).filter(
      item => (item as Record<string, any>).deleted !== true,
    );
    return (
      <div class={this.$props.class}>
        <ZTable<TData>
          tableRef={ref => {
            this.tableRef = ref;
            $$details.setTableRef(ref as unknown as BeanControllerTableBase<{}>);
          }}
          data={data}
          schema={$$details.schemaRow}
          tableScope={$$details.jsxCelScope}
          getRowId={(_originalRow: TData, index: number) => {
            return String(index);
          }}
        ></ZTable>
      </div>
    );
  }
}
