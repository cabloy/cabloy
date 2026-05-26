import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { VNode } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerTableCellTestProps {
  showLog?: boolean;
  slotHeader?: (scope: { name: string }) => VNode;
  slotFooter?: (scope: { name: string }) => VNode;
}

@Controller()
export class ControllerTableCellTest extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextTableCell;

  protected async __init__() {}

  protected render() {
    const { name, value } = this.$$renderContext.$celScope;
    const domCell = this.$slotDefault ? this.$slotDefault() : value;
    return (
      <>
        {this.$props.slotHeader?.({ name: 'kevin' })}
        {domCell}
        {this.$props.showLog && <div>{`log: ${name}`}</div>}
        {this.$props.slotFooter?.({ name: 'jimmy' })}
      </>
    );
  }
}
