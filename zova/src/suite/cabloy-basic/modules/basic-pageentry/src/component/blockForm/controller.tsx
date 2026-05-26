import type { IResourceBlockOptionsBase, IJsxRenderContextPageEntry } from 'zova-module-a-openapi';

import { BeanControllerBase, type IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase, ZForm } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-pageentry:blockForm'?: ControllerBlockFormProps;
  }
}

export interface ControllerBlockFormProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockForm extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formRef: BeanControllerFormBase;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  protected render() {
    const { $$pageEntry } = this.$$renderContext;
    return (
      <ZForm
        class={this.$props.class}
        controllerRef={ref => {
          this.formRef = ref;
          $$pageEntry.formRef = ref;
        }}
        formTag="div"
        data={$$pageEntry.formData}
        schema={$$pageEntry.formSchema}
        schemaScene={$$pageEntry.schemaScene}
        formMeta={$$pageEntry.formMeta}
        formProvider={$$pageEntry.formProvider}
        formScope={$$pageEntry.jsxCelScope}
        onSubmitData={data => $$pageEntry.submitData(data)}
        onShowError={({ error }) => {
          // eslint-disable-next-line no-alert
          window.alert(error.message);
        }}
        onChanged={data => {
          $$pageEntry.setPageMeta(data, true);
        }}
      ></ZForm>
    );
  }
}
