import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase, IJsxRenderContextDetails } from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerTableBase, ZTable } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockTable'?: ControllerBlockTableProps;
  }
}

export interface ControllerBlockTableProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockTable<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: BeanControllerTableBase<TData>;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected async __init__() {}

  protected render() {
    const { $$details } = this.$$renderContext;
    return (
      <ZTable<TData>
        class={this.$props.class}
        controllerRef={ref => {
          this.tableRef = ref;
          $$details.tableRef = ref as unknown as BeanControllerTableBase<{}>;
        }}
        data={$$details.data as unknown as TData[]}
        schema={$$details.schemaRow}
        tableScope={$$details.jsxCelScope}
      ></ZTable>
    );
  }
}
