import { celEnvBase } from '@cabloy/utils';
import { classes } from 'typestyle';
import { VNode } from 'vue';
import { BeanBase, deepExtend, UseScope } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Service } from 'zova-module-a-bean';
import {
  BeanControllerFormBase,
  formMetaFromFormScene,
  TypeFormOnSubmitData,
} from 'zova-module-a-form';
import {
  IDetailScope,
  IFormMeta,
  IFormProvider,
  IJsxRenderContextDetail,
  ISchemaObjectExtensionField,
  ScopeModuleAOpenapi,
  TypeFormScene,
  TypeFormSchemaScene,
} from 'zova-module-a-openapi';
import { AppModalItem } from 'zova-module-basic-app';
import { inferImageRelationName } from 'zova-module-basic-image';

import { IDialogFormOptions } from '../types/dialogForm.js';

@Service()
export class ServiceDetail<TData extends {} = {}> extends BeanBase {
  private options: IDialogFormOptions<TData>;
  private dialogInstance: AppModalItem | undefined;

  formRef: BeanControllerFormBase<TData> | undefined;

  formScene: TypeFormScene;
  schemaScene: TypeFormSchemaScene;

  formMeta: IFormMeta;
  formProvider: IFormProvider;
  formSchema?: ISchemaObjectExtensionField;
  formData?: TData;

  jsxZova: ZovaJsx;
  jsxCelScope: IDetailScope;
  jsxRenderContext: IJsxRenderContextDetail<TData>;

  @UseScope()
  $$scopeOpenapi: ScopeModuleAOpenapi;

  protected async __init__(options: IDialogFormOptions<TData>) {
    this.options = options;
    this.formScene = options.formScene;
    this.schemaScene = options.schemaScene;
    this.formMeta = formMetaFromFormScene(this.formScene);
    this.formProvider = this.$$scopeOpenapi.config.formProvider;
    this.formSchema = options.schema;
    this.formData = options.data;
    // jsx
    this._prepareJsx();
  }

  private _prepareJsx() {
    const jsxCelEnv = celEnvBase.clone();
    this.jsxZova = this.bean._newBeanSimple(
      ZovaJsx,
      false,
      this.formProvider.components,
      jsxCelEnv,
    );
    this.jsxCelScope = this._prepareJsxCelScope();
    this.jsxRenderContext = {
      app: this.app,
      ctx: this.ctx,
      $scene: 'detail',
      $host: this,
      $celScope: this.jsxCelScope,
      $jsx: this.jsxZova,
      $$detail: this,
    };
  }

  private _prepareJsxCelScope(): IDetailScope {
    // eslint-disable-next-line
    const self = this;
    const $$detail = this.$customRef(() => {
      return {
        get() {
          return self;
        },
        set(_value) {},
      };
    }) as any;
    return {
      formMeta: this.formMeta,
      $$detail,
    };
  }

  private _renderBlocks() {
    const blocks = this.formSchema?.rest?.blocks;
    if (!blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = Object.assign({ key: index }, block.options);
      const domBlock = this.jsxZova.render(
        block.render!,
        options,
        this.jsxCelScope,
        this.jsxRenderContext,
      );
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return domBlocks;
  }

  public closeDialog() {
    if (this.dialogInstance) {
      this.dialogInstance.close();
      this.dialogInstance = undefined;
    }
  }

  public buildSubmittedDetailItem(data: TypeFormOnSubmitData<TData>, dataOld?: TData) {
    const detailItem = deepExtend({}, dataOld ?? {}, data.value) as Record<string, any>;
    const properties = this.$sdk.loadSchemaProperties(this.formSchema, this.schemaScene);
    if (!properties || properties.length === 0 || !this.formRef) return detailItem as TData;
    for (const property of properties) {
      this._hydrateDetailItemRelation(detailItem, property, data);
    }
    return detailItem as TData;
  }

  public submitData(data: TypeFormOnSubmitData<TData>) {
    this.options.onSubmitData?.(data, this.dialogInstance!);
  }

  private _hydrateDetailItemRelation(
    detailItem: Record<string, any>,
    property: ISchemaObjectExtensionField,
    data: TypeFormOnSubmitData<TData>,
  ) {
    const renderProvider = property.rest?.render;
    if (renderProvider !== 'basic-image:formFieldImage') return;
    const relationName = this._getRelationNameOfField(property, property.rest);
    if (!relationName) return;
    const relationValue = data.formApi.getFieldValue(relationName as never);
    detailItem[relationName] = this._cloneRelationValue(relationValue);
  }

  private _getRelationNameOfField(
    property: ISchemaObjectExtensionField,
    options?: Record<string, any>,
  ) {
    return inferImageRelationName(property.key, options?.relationName as string | undefined);
  }

  private _cloneRelationValue(relationValue: unknown) {
    if (Array.isArray(relationValue)) {
      return deepExtend([], relationValue);
    }
    if (relationValue && typeof relationValue === 'object') {
      return deepExtend({}, relationValue as Record<string, any>);
    }
    return relationValue;
  }

  openDialogForm() {
    const options = this.options;
    this.dialogInstance = this.$appModal.dialog(
      {
        icon: options.icon,
        title: options.title,
        slotDefault: () => {
          return <>{this._renderBlocks()}</>;
        },
        slotActions: () => {
          const isSubmitting = this.formRef?.formState.isSubmitting;
          return (
            <>
              {isSubmitting && <span class="loading loading-spinner text-primary"></span>}
              <button
                type="button"
                class="btn btn-ghost"
                onClick={() => {
                  this.closeDialog();
                }}
              >
                {options.locale.Cancel()}
              </button>
              {this.formScene !== 'view' && (
                <button
                  type="button"
                  class={classes('btn btn-primary', isSubmitting && 'btn-disabled')}
                  onClick={async () => {
                    if (isSubmitting) return;
                    await this.formRef?.submit();
                  }}
                >
                  {options.locale.OK()}
                </button>
              )}
            </>
          );
        },
      },
      options.dialogOptions,
    );
  }
}
