import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase, IJsxRenderContextDetail } from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase, ZForm } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockForm'?: ControllerBlockFormProps;
  }
}

export interface ControllerBlockFormProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockForm extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formRef: BeanControllerFormBase;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetail;

  protected async __init__() {}

  protected render() {
    const { $$detail } = this.$$renderContext;
    return (
      <ZForm
        class={this.$props.class}
        controllerRef={ref => {
          this.formRef = ref;
          $$detail.formRef = ref;
        }}
        data={$$detail.formData}
        schema={$$detail.formSchema}
        schemaScene={$$detail.schemaScene}
        formMeta={$$detail.formMeta}
        formProvider={$$detail.formProvider}
        formScope={$$detail.jsxCelScope}
        onSubmitData={data => $$detail.submitData(data)}
        onShowError={async ({ error }) => {
          await this.$performCommand('basic-commands:alert', {
            type: 'error',
            text: error.message,
          });
        }}
      ></ZForm>
    );
  }
}
