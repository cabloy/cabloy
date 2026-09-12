import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'basic-table:actionDeleteBulk'?: ControllerActionDeleteBulkProps;
  }
}

export interface ControllerActionDeleteBulkProps extends IResourceTableActionBulkPropsBase {}

@Controller()
export class ControllerActionDeleteBulk extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-error join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected render() {
    const { dynamicDisabledReason, dynamicSelection } = this.$props;
    const disabled = this.$props.disabled === true || this.$props.dynamicDisabled === true;
    return (
      <button
        class={this.$props.class}
        type="button"
        disabled={disabled}
        title={dynamicDisabledReason}
        aria-description={dynamicDisabledReason}
        onClick={async () => {
          if (disabled) return;
          const confirmed = await this.$performCommand(
            'basic-commands:confirm',
            {
              text: this.scope.locale.DeleteBulkConfirm(dynamicSelection?.count ?? 0),
            },
            this.$$renderContext,
          );
          if (!confirmed) return;
          await this.$performCommand(
            'basic-commands:deleteBulk',
            this.$props,
            this.$$renderContext,
          );
        }}
      >
        {this.scope.locale.DeleteBulk() as string}
      </button>
    );
  }
}
