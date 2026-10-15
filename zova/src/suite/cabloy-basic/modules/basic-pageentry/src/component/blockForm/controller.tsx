import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPageEntry,
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase, ZForm } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-pageentry:blockForm'?: ControllerBlockFormProps;
  }
}

export interface ControllerBlockFormProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
}

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
          $$pageEntry.formReady(ref);
        }}
        formTag="div"
        data={$$pageEntry.editorData}
        schema={$$pageEntry.formSchema}
        schemaScene={$$pageEntry.schemaScene}
        localePresentationRefresh={{
          identity: JSON.stringify([
            $$pageEntry.resource,
            $$pageEntry.entryId ?? null,
            $$pageEntry.formScene,
          ]),
        }}
        formMeta={$$pageEntry.formMeta}
        formProvider={$$pageEntry.formProvider}
        blocks={this.$props.blocks}
        formScope={$$pageEntry.jsxCelScope}
        onSubmitData={data => $$pageEntry.submitData(data)}
        onShowError={async ({ error }) => {
          await this.$performCommand('basic-commands:alert', {
            type: 'error',
            text: error.message,
          });
        }}
        onChanged={data => {
          $$pageEntry.formChanged(data);
        }}
        onSchemaRefreshed={data => $$pageEntry.formSchemaRefreshed(data)}
      ></ZForm>
    );
  }
}
