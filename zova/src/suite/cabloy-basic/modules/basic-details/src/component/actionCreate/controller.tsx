import type { IComponentOptions } from 'zova';
import type {
  IFormMeta,
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';
import type { IModalDialogRenderContext } from 'zova-module-basic-app';

import { classes } from 'typestyle';
import { BeanControllerBase, Use, uuid } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  BeanControllerFormBase,
  formMetaFromFormScene,
  TypeFormOnSubmitData,
  ZForm,
} from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'basic-details:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceDetailsActionBulkOptionsBase {}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-info join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formRef: BeanControllerFormBase;
  formData: Record<string, any>;
  formMeta: IFormMeta;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected async __init__() {
    this.formData = {};
    this.formMeta = { ...formMetaFromFormScene('create'), formScene: 'create' };
  }

  protected render() {
    return (
      <button
        class={this.$props.class}
        type="button"
        onClick={() => {
          this.onClick();
        }}
      >
        {this.scope.locale.AddDetail()}
      </button>
    );
  }

  private onClick() {
    this.formData = {};
    this.$appModal.dialog(
      {
        title: this.scope.locale.AddDetail(),
        slotDefault: dialog => this._renderDialogForm(dialog),
        slotActions: dialog => this._renderDialogActions(dialog),
      },
      {
        maxWidth: 720,
      },
    );
  }

  private _renderDialogForm(dialog: IModalDialogRenderContext) {
    const { $$details } = this.$$renderContext;
    return (
      <ZForm
        controllerRef={ref => {
          this.formRef = ref;
        }}
        formTag="div"
        data={this.formData}
        schema={$$details.schemaRow}
        schemaScene="form-create"
        formMeta={this.formMeta}
        formScope={Object.assign({ id: null }, $$details.jsxCelScope)}
        onSubmitData={data => this._submitData(data, dialog)}
        onShowError={async ({ error }) => {
          await this.$performCommand('basic-commands:alert', {
            type: 'error',
            text: error.message,
          });
        }}
      ></ZForm>
    );
  }

  private _renderDialogActions(dialog: IModalDialogRenderContext) {
    const isSubmitting = this.formRef?.formState.isSubmitting;
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
            await this.formRef?.submit();
          }}
        >
          {this.scope.locale.AddDetail()}
        </button>
      </>
    );
  }

  private _submitData(
    data: TypeFormOnSubmitData<Record<string, any>>,
    dialog: IModalDialogRenderContext,
  ) {
    const { $$details } = this.$$renderContext;
    const detailItem = Object.assign({ id: uuid() }, data.value);
    $$details.data = [...$$details.data, detailItem];
    dialog.close();
  }
}
