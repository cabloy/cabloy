import type { BeanBase } from 'zova';
import type { TypeFormOnSubmitData } from 'zova-module-a-form';
import type { IIconRecord } from 'zova-module-a-icon';
import type { TypeFormScene, TypeFormSchemaScene } from 'zova-module-a-openapi';
import type { IModalDialogOptions, IModalDialogRenderContext } from 'zova-module-basic-app';

import { classes } from 'typestyle';
import { BeanControllerFormBase, formMetaFromFormScene, ZForm } from 'zova-module-a-form';

export interface IDialogFormOptions {
  $host: Pick<BeanBase, '$appModal' | '$performCommand'>;
  locale: {
    Cancel: () => string;
    OK: () => string;
  };
  schema: any;
  data: Record<string, any>;
  formScene: TypeFormScene;
  schemaScene: TypeFormSchemaScene;
  dialogOptions?: IModalDialogOptions;
  icon?: keyof IIconRecord;
  title: string;
  onSubmitData: (
    data: TypeFormOnSubmitData<Record<string, any>>,
    dialog: IModalDialogRenderContext,
  ) => void | Promise<void>;
}

export function openDialogForm(options: IDialogFormOptions) {
  const { $host } = options;
  const formMeta = formMetaFromFormScene(options.formScene);
  let formRef: BeanControllerFormBase | undefined;
  $host.$appModal.dialog(
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
              await $host.$performCommand('basic-commands:alert', {
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
