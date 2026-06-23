import type { IModalDialogRenderContext } from 'zova-module-basic-app';

import { classes } from 'typestyle';
import { BeanControllerFormBase, formMetaFromFormScene, ZForm } from 'zova-module-a-form';

import { IDialogFormOptions } from '../types/dialogForm.js';

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
