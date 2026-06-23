import { classes } from 'typestyle';
import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';
import { BeanControllerFormBase, formMetaFromFormScene, ZForm } from 'zova-module-a-form';
import { IFormMeta, TypeFormScene, TypeFormSchemaScene } from 'zova-module-a-openapi';
import { IModalDialogRenderContext } from 'zova-module-basic-app';

import { IDialogFormOptions } from '../types/dialogForm.js';

@Service()
export class ServiceDetail extends BeanBase {
  private options: IDialogFormOptions;
  formRef: BeanControllerFormBase | undefined;
  schema: any;
  data: Record<string, any>;
  formScene: TypeFormScene;
  schemaScene: TypeFormSchemaScene;
  formMeta: IFormMeta;

  protected async __init__(options: IDialogFormOptions) {
    this.options = options;
    this.schema = options.schema;
    this.data = options.data;
    this.formScene = options.formScene;
    this.schemaScene = options.schemaScene;
    this.formMeta = formMetaFromFormScene(this.formScene);
  }

  openDialogForm() {
    const options = this.options;
    const formMeta = formMetaFromFormScene(options.formScene);
    let formRef: BeanControllerFormBase | undefined;
    this.$appModal.dialog(
      {
        icon: options.icon,
        title: options.title,
        slotDefault: (dialog: IModalDialogRenderContext) => {
          return (
            <ZForm
              controllerRef={ref => {
                formRef = ref;
              }}
              data={options.data}
              schema={options.schema}
              schemaScene={options.schemaScene}
              formMeta={formMeta}
              onSubmitData={data => options.onSubmitData(data, dialog)}
              onShowError={async ({ error }) => {
                await this.$performCommand('basic-commands:alert', {
                  type: 'error',
                  text: error.message,
                });
              }}
            ></ZForm>
          );
        },
        slotActions: (dialog: IModalDialogRenderContext) => {
          const isSubmitting = formRef?.formState.isSubmitting;
          return (
            <>
              {isSubmitting && <span class="loading loading-spinner text-primary"></span>}
              <button
                type="button"
                class="btn btn-ghost"
                onClick={() => {
                  dialog.close();
                }}
              >
                {options.locale.Cancel()}
              </button>
              <button
                type="button"
                class={classes('btn btn-primary', isSubmitting && 'btn-disabled')}
                onClick={async () => {
                  if (isSubmitting) return;
                  await formRef?.submit();
                }}
              >
                {options.locale.OK()}
              </button>
            </>
          );
        },
      },
      options.dialogOptions,
    );
  }
}
