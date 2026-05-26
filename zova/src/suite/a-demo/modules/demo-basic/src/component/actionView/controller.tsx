import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerActionViewProps {
  onClick?: () => void;
}

@Controller()
export class ControllerActionView extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextTableCell;

  protected async __init__() {}

  protected render() {
    if (!this.$$renderContext) throw new Error('should used in table');
    const { $celScope } = this.$$renderContext;
    return (
      <a
        class="hover:text-blue-500"
        href="#"
        onClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          await this.$performCommand('basic-commands:view', undefined, this.$$renderContext);
        }}
      >
        {this.$slotDefault ? this.$slotDefault() : $celScope.value}
      </a>
    );
  }
}
