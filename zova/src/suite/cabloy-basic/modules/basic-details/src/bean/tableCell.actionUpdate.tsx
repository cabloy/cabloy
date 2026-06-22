import type { IFormMeta, IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';
import type { IModalDialogOptions, IModalDialogRenderContext } from 'zova-module-basic-app';

import { classes } from 'typestyle';
import { BeanBase, deepExtend } from 'zova';
import {
  BeanControllerFormBase,
  formMetaFromFormScene,
  TypeFormOnSubmitData,
  ZForm,
} from 'zova-module-a-form';
import { IIconRecord, ZIcon } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'basic-details:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}

export interface ITableCellOptionsActionUpdate extends IResourceDetailsActionRowOptionsBase {
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@TableCell<ITableCellOptionsActionUpdate>({
  class: 'btn btn-outline btn-primary join-item',
})
export class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdate,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, $celScope, cellContext } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          const $$details = $celScope.$$details;
          if (!$$details) throw new Error('should provide $$details in cell scope');
          const detailItem = cellContext.row.original as Record<string, any>;
          const detailItemId = detailItem.id;
          const detailItemIndex = cellContext.row.index;
          const formData = deepExtend({}, detailItem);
          const formMeta = formMetaFromFormScene('edit');
          let formRef: BeanControllerFormBase | undefined;
          $host.$appModal.dialog(
            {
              icon: options.dialogOptions?.icon,
              title: options.dialogOptions?.title ?? this.scope.locale.EditDetail(),
              slotDefault: (dialog: IModalDialogRenderContext) => {
                return (
                  <ZForm
                    controllerRef={ref => {
                      formRef = ref;
                    }}
                    data={formData}
                    schema={$$details.schemaForm}
                    schemaScene="form"
                    formMeta={formMeta as IFormMeta}
                    formScope={{ id: detailItemId }}
                    onSubmitData={(data: TypeFormOnSubmitData<Record<string, any>>) => {
                      const detailItemNew = deepExtend({}, detailItem, data.value);
                      if (detailItemId !== undefined && detailItemId !== null) {
                        detailItemNew.id = detailItemId;
                      }
                      $$details.data = $$details.data.map((item, index) => {
                        if (detailItemId !== undefined && detailItemId !== null) {
                          return item.id === detailItemId ? detailItemNew : item;
                        }
                        return index === detailItemIndex ? detailItemNew : item;
                      });
                      dialog.close();
                    }}
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
                      {this.scope.locale.Cancel()}
                    </button>
                    <button
                      type="button"
                      class={classes('btn btn-primary', isSubmitting && 'btn-disabled')}
                      onClick={async () => {
                        if (isSubmitting) return;
                        await formRef?.submit();
                      }}
                    >
                      {this.scope.locale.OK()}
                    </button>
                  </>
                );
              },
            },
            options.dialogOptions,
          );
        }}
      >
        <ZIcon name="::draft" width={24}></ZIcon>
      </button>
    );
  }
}
