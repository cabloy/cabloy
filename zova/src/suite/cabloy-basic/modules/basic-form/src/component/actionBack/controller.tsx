import type {
  IJsxRenderContextPageEntry,
  IResourceFormActionRowOptionsBase,
} from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase, type IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormActionRowRecord {
    'basic-form:actionBack'?: ControllerActionBackProps;
  }
}

export interface ControllerActionBackProps extends IResourceFormActionRowOptionsBase {}

@Controller()
export class ControllerActionBack extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-secondary join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  protected render() {
    const { $$pageEntry } = this.$$renderContext;
    const formRef: BeanControllerFormBase = $$pageEntry.formRef;
    const isSubmitting = formRef?.formState.isSubmitting;
    return (
      <button
        class={classes(this.$props.class, isSubmitting && 'btn-disabled')}
        type="button"
        onClick={() => {
          this.$router.back();
        }}
      >
        {this.scope.locale.Back()}
      </button>
    );
  }
}
