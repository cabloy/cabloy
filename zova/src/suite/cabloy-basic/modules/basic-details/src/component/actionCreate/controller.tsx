import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';
import type { IModalDialogOptions, IModalDialogRenderContext } from 'zova-module-basic-app';

import { classes } from 'typestyle';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  BeanControllerFormBase,
  formMetaFromFormScene,
  TypeFormOnSubmitData,
  ZForm,
} from 'zova-module-a-form';
import { IIconRecord } from 'zova-module-a-icon';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'basic-details:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceDetailsActionBulkOptionsBase {
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-info join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected render() {
    return (
      <button
        class={this.$props.class}
        type="button"
        onClick={() => {
          const { $$details } = this.$$renderContext;
          const formData = {};
          const formMeta = formMetaFromFormScene('create');
          let formRef: BeanControllerFormBase | undefined;
          this.$appModal.dialog(
            {
              icon: this.$props.dialogOptions?.icon,
              title: this.$props.dialogOptions?.title ?? this.scope.locale.AddDetail(),
              slotDefault: (dialog: IModalDialogRenderContext) => {
                return (
                  <ZForm
                    controllerRef={ref => {
                      formRef = ref;
                    }}
                    data={formData}
                    schema={$$details.schemaForm}
                    schemaScene="form-create"
                    formMeta={formMeta}
                    onSubmitData={(data: TypeFormOnSubmitData<Record<string, any>>) => {
                      const detailItem = data.value;
                      $$details.data = [...$$details.data, detailItem];
                      dialog.close();
                    }}
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
            this.$props.dialogOptions,
          );
        }}
      >
        {this.scope.locale.AddDetail()}
      </button>
    );
  }
}
