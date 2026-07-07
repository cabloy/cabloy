import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextPage, IResourceBlockOptionsBase } from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerTableBase, ZTable } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockTable'?: ControllerBlockTableProps;
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
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {}

  get permissions() {
    return this.$$renderContext.$celScope.permissions;
  }

  protected render() {
    const { $$page } = this.$$renderContext;
    return (
      <div class={this.$props.class}>
        <ZTable<TData>
          controllerRef={ref => {
            this.tableRef = ref;
            $$page.tableRef = ref as unknown as BeanControllerTableBase<{}>;
          }}
          data={$$page.data as unknown as TData[]}
          schema={$$page.schemaRow}
          tableScope={$$page.jsxCelScope}
        ></ZTable>
      </div>
    );
  }
}
