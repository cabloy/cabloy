import { catchError, celEnvBase, isEmptyObject, isNil } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
import {
  DeepKeys,
  determineFormLevelErrorSourceAndValue,
  FormValidationError,
  getBy,
  isGlobalFormValidationError,
  revalidateLogic,
  useStore,
  ValidationCause,
  ValidationError,
} from '@tanstack/vue-form';
import { SchemaObject } from 'openapi3-ts/oas31';
import { VNode } from 'vue';
import { z } from 'zod';
import { $ZodIssue } from 'zod/v4/core';
import { cast, deepEqual, deepExtend, objectAssignReactive, UseScope } from 'zova';
import { isJsxComponent, ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import {
  IFormMeta,
  IFormProvider,
  IResourceFormFieldLayoutOptions,
  renderFormFieldTopPropsSystem,
  TypeFormFieldRenderComponent,
  TypeFormFieldRenderComponentProvider,
  TypeFormSchemaScene,
  ScopeModuleAOpenapi,
  ISchemaObjectExtensionField,
} from 'zova-module-a-openapi';

import { BeanControllerFormBase } from '../../lib/beanControllerFormBase.js';
import {
  IFormScope,
  RevalidateLogicProps,
  TypeFormOnShowError,
  TypeFormOnSubmit,
  TypeFormOnSubmitInvalid,
} from '../../types/form.js';
import {
  constFieldProps,
  IFormFieldOptions,
  IFormFieldRenderContextPropsBucket,
  IFormFieldScope,
  IJsxRenderContextFormField,
} from '../../types/formField.js';
import { ControllerFormField } from '../formField/controller.jsx';

export interface ControllerFormProps<TFormData extends {} = {}, TSubmitMeta = never> {
  formTag?: string;
  inline?: boolean;
  data?: TFormData;
  schema?: SchemaObject;
  schemaScene?: TypeFormSchemaScene;
  zodSchema?: z.ZodObject<any>;
  validateOnDynamic?: boolean;
  validateOnDynamicLogic?: RevalidateLogicProps;
  formMeta?: IFormMeta;
  formProvider?: IFormProvider;
  formScope?: IFormScope;
  formFieldLayout?: IResourceFormFieldLayoutOptions;
  onFormSubmit?: (e: SubmitEvent, form: ControllerForm<TFormData, TSubmitMeta>) => any;
  onSubmitInvalid?: TypeFormOnSubmitInvalid<TFormData, TSubmitMeta>;
  onSubmitData?: TypeFormOnSubmit<TFormData, TSubmitMeta>;
  onShowError?: TypeFormOnShowError<TFormData, TSubmitMeta>;
  onChanged?: (data: TFormData) => void;
  slotDefault?: (form: ControllerForm<TFormData, TSubmitMeta>) => VNode;
  slotHeader?: (form: ControllerForm<TFormData, TSubmitMeta>) => VNode;
  slotBody?: (children: VNode, form: ControllerForm<TFormData, TSubmitMeta>) => VNode;
  slotFooter?: (form: ControllerForm<TFormData, TSubmitMeta>) => VNode;
  slotWrapper?: (
    children: (VNode | undefined)[],
    form: ControllerForm<TFormData, TSubmitMeta>,
  ) => VNode;
}
@Controller()
export class ControllerForm<
  TFormData extends {} = {},
  TSubmitMeta = never,
> extends BeanControllerFormBase<TFormData, TSubmitMeta> {
  static $propsDefault = { formTag: 'form', schemaScene: 'form' };

  formProvider: IFormProvider;
  schema: SchemaObject | undefined;
  zodSchema: z.ZodObject<any> | undefined;
  properties: ISchemaObjectExtensionField[] | undefined;
  zovaJsx: ZovaJsx;
  fieldCelEnv: typeof celEnvBase;

  @UseScope()
  $$scopeOpenapi: ScopeModuleAOpenapi;

  protected async __init__() {
    this.bean._setBean('$$form', this);
    this.form = this._createForm();
    this.formState = useStore(this.form.store, state => state) as any;
    this.formProvider = this.$computed(() => {
      const formProvider = this.$$scopeOpenapi.config.formProvider;
      return this.$props.formProvider
        ? deepExtend({}, formProvider, this.$props.formProvider)
        : formProvider;
    });
    this.schema = this.$computed(() => {
      return this.$props.schema;
    });
    this.zodSchema = this.$computed(() => {
      return this._getZodSchema();
    });
    this.properties = this.$computed(() => {
      return this.$sdk.loadSchemaProperties(this.schema, this.$props.schemaScene);
    });
    this.fieldCelEnv = this._getFieldCelEnv();
    this.zovaJsx = this.bean._newBeanSimple(
      ZovaJsx,
      false,
      this.formProvider.components,
      this.fieldCelEnv,
    );
    this.$watch(
      () => this.$props.data,
      (newValue, oldValue) => {
        if (deepEqual(newValue, oldValue)) return;
        this.reset(this.$props.data);
      },
    );
  }

  public async submit(submitMeta?: TSubmitMeta): Promise<boolean> {
    const [_, error] = await catchError(() => {
      return this.form.handleSubmit(submitMeta as any);
    });
    return !error && this.formState.isValid;
  }

  public reset(values?: TFormData, opts?: { keepDefaultValues?: boolean }): TFormData {
    this.form.reset(values ?? ({} as TFormData), opts);
    return this.form.state.values;
  }

  public get formMeta() {
    return this.$props.formMeta;
  }

  public getFieldValue<K extends DeepKeys<TFormData>>(name: K) {
    return getBy(this.formState.values, name) ?? null;
  }

  public setFieldValue<K extends DeepKeys<TFormData>>(
    name: K,
    value: any,
    disableNotifyChanged?: boolean,
  ) {
    this.form.setFieldValue(name, value);
    if (!disableNotifyChanged) {
      this.$props.onChanged?.(this.formState.values);
    }
  }

  public getFieldProperty<K extends DeepKeys<TFormData>>(
    name: K,
  ): ISchemaObjectExtensionField | undefined {
    if (!this.properties) return;
    return this.properties.find(item => item.key === name);
  }

  public getFieldZodSchema<K extends DeepKeys<TFormData>>(name: K) {
    return ZodMetadata.getFieldSchema(this.zodSchema, name as string);
  }

  private _getFieldCelEnv(): typeof celEnvBase {
    const celEnv = celEnvBase.clone();
    celEnv.registerFunction('getValue(string):dyn', name => {
      return this.form.getFieldValue(name) ?? null;
    });
    celEnv.registerFunction('getProperty(string):dyn', name => {
      return this.getFieldProperty(name) ?? null;
    });
    return celEnv;
  }

  public getFieldScope<K extends DeepKeys<TFormData>>(
    name: K,
    scopeExtra?: {},
  ): IFormFieldScope<TFormData> {
    return objectAssignReactive({}, this.$props.formScope, {
      name,
      value: this.getFieldValue(name),
      property: this.getFieldProperty(name),
      ...scopeExtra,
    });
  }

  public getFieldJsxRenderContext(
    $$formField: ControllerFormField<TFormData> | undefined,
    celScope: IFormFieldScope<TFormData>,
  ): IJsxRenderContextFormField<TFormData, TSubmitMeta> {
    return {
      app: this.app,
      ctx: this.ctx,
      $scene: 'formField',
      $host: $$formField ?? this,
      $celScope: celScope,
      $jsx: this.zovaJsx,
      $$formField,
      $$form: this,
    };
  }

  public getFieldComponentPropsTop<K extends DeepKeys<TFormData>>(
    name: K,
    celScope: IFormFieldScope<TFormData>,
    jsxRenderContext: {},
  ): IFormFieldRenderContextPropsBucket {
    const props = this._getFieldComponentPropsTopInner(name, celScope, jsxRenderContext);
    return props;
  }

  private _getFieldComponentPropsTopInner<K extends DeepKeys<TFormData>>(
    name: K,
    celScope: IFormFieldScope<TFormData>,
    jsxRenderContext: {},
  ): IFormFieldRenderContextPropsBucket {
    let props: any = {
      [constFieldProps]: true,
      key: name,
      name,
      value: celScope.value,
    };
    const property = this.getFieldProperty(name);
    if (!property) return props;
    const rest = property.rest;
    if (!rest) return props;
    const keys = Object.keys(rest).filter(item => !renderFormFieldTopPropsSystem.includes(item));
    if (keys.length === 0) return props;
    for (const key of keys) {
      const value = rest[key];
      let keyValue;
      if (key === 'render') {
        if (typeof value === 'string') {
          keyValue = this.zovaJsx.evaluateExpression(value, celScope);
        } else {
          keyValue = value;
        }
      } else {
        keyValue = this.zovaJsx.renderJsxOrCel(value, undefined, celScope, jsxRenderContext);
      }
      props[key] = keyValue;
    }
    // render
    const needAppend = isJsxComponent(props.render) && this.isComponentFormField(props.render.type);
    if (needAppend && !isEmptyObject(props.render.props)) {
      const propsAppend = this.zovaJsx.renderJsxOrCel(
        props.render.props,
        undefined,
        celScope,
        jsxRenderContext,
      );
      props = Object.assign({}, props, propsAppend);
    }
    // readonly
    const readonlyTemp = props.readonly;
    if (isNil(readonlyTemp) && this.formMeta?.formMode === 'view') {
      props.readonly = true;
    }
    // ok
    return props;
  }

  // public getRenderFlattern(render: TypeFormFieldRenderComponent): TypeFormFieldRenderComponent {
  //   return isJsxComponent(render) ? cast(render).type : render;
  // }

  public getRenderProvider(
    render: TypeFormFieldRenderComponent,
  ): TypeFormFieldRenderComponentProvider {
    if (isJsxComponent(render)) {
      return cast(render).type;
    }
    if (typeof render === 'string') {
      return this.formProvider.components?.[render] ?? render;
    }
    return render as TypeFormFieldRenderComponentProvider;
  }

  private _getZodSchema() {
    if (this.$props.zodSchema) return this._patchZodSchema(this.$props.zodSchema);
    if (!this.schema) return;
    return this._patchZodSchema(this.$sdk.schemaToZodSchema(this.schema));
  }

  private _patchZodSchema(schema: z.ZodObject<any> | z.ZodUnion<any>) {
    if (schema.def.type === 'object') return schema;
    if (schema.def.type === 'union') {
      return schema.def.options.find(item => item.def.type === 'object');
    }
    throw new Error('invalid zod schema');
  }

  private _createForm() {
    // not use $computed
    return this.$useForm<TFormData, TSubmitMeta>({
      defaultValues: this.$props.data,
      validationLogic:
        this.$props.validateOnDynamic !== false
          ? revalidateLogic(this.$props.validateOnDynamicLogic)
          : undefined,
      onSubmitInvalid: data => {
        this.$props.onSubmitInvalid?.(data, this);
      },
      onSubmit: async data => {
        const [_, error] = await catchError(() => {
          return this.$props.onSubmitData?.(data, this);
        });
        // emit event
        const resHandled = await this.app.meta.event.emit('a-form:formSubmission', {
          form: this.form as any,
          data,
          error,
        });
        if (!error) return;
        if (error.code === 422) {
          this._handleError422(error);
          this.$props.onSubmitInvalid?.(data, this);
        } else {
          if (!resHandled) {
            this.$props.onShowError?.({ data, error }, this);
          }
        }
        // must throw error for stop next logic
        throw error;
      },
    });
  }

  public renderField<K extends DeepKeys<TFormData>>(
    name: K,
    propsExtra?: IFormFieldOptions<TFormData>,
  ) {
    const property = this.getFieldProperty(name);
    const key = property?.key ?? name;
    return this._renderFieldByKey(key, propsExtra);
  }

  protected _renderFieldByKey(key: string, propsExtra?: IFormFieldOptions<TFormData>) {
    // celScope
    const celScope = this.getFieldScope(key);
    const jsxRenderContext = this.getFieldJsxRenderContext(undefined, celScope);
    // props
    let props = this.getFieldComponentPropsTop(key, celScope, jsxRenderContext);
    if (propsExtra) {
      props = Object.assign({}, props, propsExtra);
    }
    if (cast(props).visible === false) return;
    const componentOptions = this._getFieldComponentOptionsTop(props.render);
    return this.zovaJsx.render(componentOptions, props, celScope, jsxRenderContext);
  }

  private _getFieldComponentOptionsTop(
    render: TypeFormFieldRenderComponent,
  ): TypeFormFieldRenderComponent {
    render = render ?? 'Input';
    const renderProvider = this.getRenderProvider(render);
    if (this.isComponentFormField(renderProvider)) {
      return renderProvider as TypeFormFieldRenderComponent;
    }
    return 'a-form:formField';
  }

  public isComponentFormField(renderProvider?: TypeFormFieldRenderComponentProvider) {
    return typeof renderProvider === 'string' && renderProvider.includes(':formField');
  }

  private _handleError422(error: Error, cause: ValidationCause = 'submit') {
    const formApi = this.form;

    let hasErrored = false as boolean;

    // This map will only include fields that have errors in the current validation cycle
    const currentValidationErrorMap: any = {};

    const rawError = parseIssues(error);
    const { formError, fieldErrors } = normalizeError<TFormData>(rawError);

    const errorMapKey = getErrorMapKey(cause);

    for (const field of Object.keys(formApi.state.fieldMeta) as DeepKeys<TFormData>[]) {
      if (formApi.baseStore.state.fieldMetaBase[field] === undefined) {
        continue;
      }

      const fieldMeta = formApi.getFieldMeta(field);
      if (!fieldMeta) continue;

      const { errorMap: currentErrorMap, errorSourceMap: currentErrorMapSource } = fieldMeta;

      const newFormValidatorError = fieldErrors?.[field];

      const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
        newFormValidatorError,
        isPreviousErrorFromFormValidator: currentErrorMapSource?.[errorMapKey] === 'form',
        previousErrorValue: currentErrorMap?.[errorMapKey],
      });

      if (newSource === 'form') {
        currentValidationErrorMap[field] = {
          ...currentValidationErrorMap[field],
          [errorMapKey]: newFormValidatorError,
        };
      }

      if (currentErrorMap?.[errorMapKey] !== newErrorValue) {
        formApi.setFieldMeta(field, prev => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            [errorMapKey]: newErrorValue,
          },
          errorSourceMap: {
            ...prev.errorSourceMap,
            [errorMapKey]: newSource,
          },
        }));
      }
    }

    if (formApi.state.errorMap?.[errorMapKey] !== formError) {
      formApi.baseStore.setState(prev => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          [errorMapKey]: formError,
        },
      }));
    }

    if (formError || fieldErrors) {
      hasErrored = true;
    }

    /**
     *  when we have an error for onSubmit in the state, we want
     *  to clear the error as soon as the user enters a valid value in the field
     */
    const submitErrKey = getErrorMapKey('submit');
    if (formApi.state.errorMap?.[submitErrKey] && cause !== 'submit' && !hasErrored) {
      formApi.baseStore.setState(prev => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          [submitErrKey]: undefined,
        },
      }));
    }

    /**
     *  when we have an error for onServer in the state, we want
     *  to clear the error as soon as the user enters a valid value in the field
     */
    const serverErrKey = getErrorMapKey('server');
    if (formApi.state.errorMap?.[serverErrKey] && cause !== 'server' && !hasErrored) {
      formApi.baseStore.setState(prev => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          [serverErrKey]: undefined,
        },
      }));
    }
  }
}

function parseIssues(error: Error) {
  const issues: $ZodIssue[] =
    typeof error.message === 'string' ? JSON.parse(error.message) : error.message;
  const fields = {};
  for (const issue of issues) {
    const key = issue.path.join('.');
    fields[key] = issue;
  }
  return { fields };
}

function normalizeError<TFormData>(rawError?: FormValidationError<unknown>): {
  formError: ValidationError;
  fieldErrors?: Partial<Record<DeepKeys<TFormData>, ValidationError>>;
} {
  if (rawError) {
    if (isGlobalFormValidationError(rawError)) {
      const formError = normalizeError(rawError.form).formError;
      const fieldErrors = rawError.fields;
      return { formError, fieldErrors } as never;
    }

    return { formError: rawError };
  }

  return { formError: undefined };
}

function getErrorMapKey(cause: ValidationCause) {
  switch (cause) {
    case 'submit':
      return 'onSubmit';
    case 'blur':
      return 'onBlur';
    case 'mount':
      return 'onMount';
    case 'server':
      return 'onServer';
    case 'dynamic':
      return 'onDynamic';
    case 'change':
    default:
      return 'onChange';
  }
}
