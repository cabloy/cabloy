import { isNil } from '@cabloy/utils';
import { useField } from '@tanstack/vue-form';
import { useSelector } from '@tanstack/vue-store';
import { markRaw } from 'vue';
import z from 'zod';
import { BeanControllerBase, IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanBehaviorsHolder, IBehaviorItem } from 'zova-module-a-behavior';

import type { ControllerForm } from '../form/controller.jsx';

import { schemaRefreshFingerprint } from '../../lib/schemaRefresh.js';
import { TypeFormField } from '../../types/form.js';
import {
  constFieldBindingSlot,
  constFieldProps,
  IFormFieldComponentOptions,
  IFormFieldOptions,
  IFormFieldRenderContext,
  IFormFieldRenderContextProps,
  IFormFieldRenderContextPropsBucket,
} from '../../types/formField.js';

export interface ControllerFormFieldProps<
  TParentData extends {} = {},
> extends IFormFieldComponentOptions<TParentData> {}

@Controller()
export class ControllerFormField<TParentData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  private _formField: TypeFormField;
  private _initialized = false;
  private _mounted = false;
  private _disposed = false;
  private _readyNotified = false;
  private _remount = false;
  public propsBucket: IFormFieldRenderContextPropsBucket<TParentData>;

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm<TParentData>;

  @Use()
  $$beanBehaviorsHolder: BeanBehaviorsHolder;

  protected async __init__() {
    if (!this.$$form) {
      throw new Error(`FormField component should be used in Form component: ${this.name}`);
    }
    // provide
    this.bean._setBean('$$formField', this);
    // field
    this._remount = this.$$form.hasSchemaRefresh(this.name);
    this._formField = this._createField();
    // propsBucket
    this.propsBucket = this.$computed(() => {
      return this._getPropsBucket();
    });
    // defaultValue
    // this._handleDefaultValue();
    this.$controllerMounted(() => {
      this._mounted = true;
      this._refreshField();
    });
    this.$watch(
      () => [this.$$form.schemaRefresh, this._getRefreshConfiguration()],
      () => this._refreshField(),
      { flush: 'post' },
    );
    // behaviors
    await this.$$beanBehaviorsHolder.initialize({
      behaviorTag: undefined as any,
      behaviors: () => {
        return this._getFieldBehaviors();
      },
    });
    // onEffect
    if (process.env.CLIENT && this.$props.onEffect) {
      this.$watch(
        () => this.$$form.getFieldValue(this.name),
        (newValue, oldValue) => {
          if (newValue === oldValue) return;
          this.$props.onEffect?.(newValue);
        },
      );
    }
    this._initialized = true;
    this._refreshField();
  }

  protected __dispose__() {
    this._disposed = true;
  }

  private _getRefreshConfiguration() {
    const props = this.$props;
    return schemaRefreshFingerprint([
      props.name,
      props.render,
      props.options,
      props.readonly,
      props.required,
      props.sys,
      props.validators,
      props.behaviors,
      !!props.onEffect,
      !!props.slotDefault,
      props[constFieldBindingSlot] === true,
    ]);
  }

  private _refreshField() {
    if (
      !this._initialized ||
      this._disposed ||
      (process.env.CLIENT && this._remount && !this._mounted) ||
      !this.$$form.schemaRefresh.contract.ready
    ) {
      return;
    }
    const props = this.$props;
    // Only explicitly renderer-owned binding slots qualify; custom slots remain opaque.
    const inputBindingSlot =
      props[constFieldProps] === true && props[constFieldBindingSlot] === true;
    const eligible =
      !props.sys &&
      !props.behaviors &&
      !props.onEffect &&
      (!props.slotDefault || inputBindingSlot) &&
      Object.values(props.validators ?? {}).every(value => typeof value === 'boolean');
    const refresh = this.$$form.consumeSchemaRefresh(
      this.name,
      this._getRefreshConfiguration(),
      eligible,
    );
    if (refresh.changed) {
      const value = this.form.getFieldValue(this.name);
      this.field.api.update(this._getFormFieldOptions() as any);
      this.form.resetField(this.name);
      if (refresh.preserve) {
        this.form.setFieldValue(this.name, value, {
          dontUpdateMeta: true,
          dontRunListeners: true,
          dontValidate: true,
        });
        this.field.api.validateSync('change', {});
      }
    } else if (this._remount && !this._readyNotified) {
      this.field.api.update(this._getFormFieldOptions() as any);
    }
    if (refresh.changed || !this._readyNotified) {
      this._readyNotified = true;
      this.$props.onFieldStateReady?.(this);
    }
    if (refresh.changed) this.$$form.schemaFieldRefreshed();
  }

  public get form() {
    return this.$$form.form;
  }

  public get field(): TypeFormField {
    return this._formField;
  }

  public get name() {
    return this.$props.name!;
  }

  public get property() {
    return this.$$form.getFieldProperty(this.name);
  }

  public get fieldZodSchema() {
    return this.$$form.getFieldZodSchema(this.name);
  }

  public get formMeta() {
    return this.$$form.formMeta;
  }

  public get formProvider() {
    return this.$$form.formProvider;
  }

  public setValue(value: any, disableNotifyChanged?: boolean) {
    if (disableNotifyChanged === undefined) {
      disableNotifyChanged = this.propsBucket.disableNotifyChanged;
    }
    return this.$$form.setFieldValue(this.name, value, disableNotifyChanged);
  }

  public handleBlur() {
    this.field.api.handleBlur();
  }

  public getRenderContext(): IFormFieldRenderContext<TParentData> {
    const name = this.name;
    // propsBucket
    const propsBucket = this.propsBucket;
    // props
    const props: IFormFieldRenderContextProps = { key: name, name };
    // class
    props.class = propsBucket.class;
    // readonly
    props.readonly = propsBucket.readonly;
    // celScope
    const celScope = this.$$form.getFieldScope(this.name, {});
    const jsxRenderContext = this.$$form.getFieldJsxRenderContext(this, celScope);
    return { propsBucket, props, celScope, jsxRenderContext };
  }

  private _createField() {
    const options = this._getFormFieldOptions();
    // A remount must not seed over a live null/undefined before refresh eligibility is known.
    if (this._remount) delete options.defaultValue;
    const field = markRaw(useField(options as any)) as any;
    const fieldState = useSelector(field.api.store, state => state) as any;
    return { api: field.api, state: fieldState };
  }

  private _getPropsBucket() {
    const property = this.property;
    const name = this.name;
    // options
    const propsTop = this._getFieldComponentPropsTop();
    // layout options
    const layoutOptions = Object.assign(
      {
        bordered: this.scope.config.formFieldLayout.bordered,
        label: property?.title ?? name,
      },
      this.$$form.$props.formFieldLayout,
      this.$props?.layout,
      propsTop?.layout,
    );
    // preset options
    const presetOptions = Object.assign({}, this.$props?.options, propsTop?.options);
    // propsBucket
    const propsBucket = Object.assign(
      {
        render: 'Input',
      },
      this.$props as IFormFieldOptions<TParentData>,
      propsTop,
      {
        layout: layoutOptions,
        options: presetOptions,
      },
    );
    // class/style: layout
    if (propsBucket.layout.class || propsBucket.layout.style) {
      propsBucket.layout.class = this.$cssMerge(
        propsBucket.layout.class,
        this.$style(propsBucket.layout.style),
      );
      delete propsBucket.layout.style;
    }
    // class/style: need not check typeof propsBucket.render === 'string' because maybe return false
    const classTemp = propsBucket.options?.class ?? propsBucket.class;
    const styleTemp = propsBucket.options?.style ?? propsBucket.style;
    if (classTemp || styleTemp) {
      propsBucket.class = this.$cssMerge(classTemp, this.$style(styleTemp));
      if (propsBucket.options?.class) delete propsBucket.options.class;
      if (propsBucket.options?.style) delete propsBucket.options.style;
      delete propsBucket.style;
    }
    // readonly
    const readonlyTemp = propsBucket.options?.readonly ?? propsBucket.readonly;
    if (!isNil(readonlyTemp)) {
      propsBucket.readonly = readonlyTemp;
      if (propsBucket.options?.readonly) delete propsBucket.options.readonly;
    } else if (this.formMeta?.formMode === 'view') {
      propsBucket.readonly = true;
    }
    // render
    // propsBucket.renderFlattern = this.$$form.getRenderFlattern(propsBucket.render);
    propsBucket.renderProvider = this.$$form.getRenderProvider(propsBucket.render);
    return propsBucket;
  }

  private _getFieldComponentPropsTop() {
    if (this.$props[constFieldProps] === true) return;
    const celScope = this.$$form.getFieldScope(this.name);
    const jsxRenderContext = this.$$form.getFieldJsxRenderContext(this, celScope);
    return this.$$form.getFieldComponentPropsTop(this.name, celScope, jsxRenderContext);
  }

  private _getFieldBehaviors() {
    const behaviors: IBehaviorItem = {};
    // custom
    if (this.$props.behaviors) {
      Object.assign(behaviors, this.$props.behaviors);
    }
    // formField
    this._prepareBehaviorFormField(behaviors);
    // formFieldLayout
    this._prepareBehaviorFormFieldLayout(behaviors);
    return behaviors;
  }

  private _prepareBehaviorFormField(behaviors: IBehaviorItem) {
    const behaviorFormField = this.formProvider.behaviors?.FormField;
    if (!behaviorFormField) return;
    behaviors[behaviorFormField] = {} as never;
  }

  private _prepareBehaviorFormFieldLayout(behaviors: IBehaviorItem) {
    const behaviorFormFieldLayout = this.formProvider.behaviors?.FormFieldLayout;
    if (!behaviorFormFieldLayout) return;
    behaviors[behaviorFormFieldLayout] = {} as never;
  }

  // private _handleDefaultValue() {
  //   const defaultValue = this.$props.defaultValue ?? this.property?.default;
  //   if (isNil(defaultValue)) return;
  //   const value = this.$$form.getFieldValue(this.name);
  //   if (isNil(value)) {
  //     this.$$form.setFieldValue(this.name, defaultValue, true);
  //   }
  // }

  private _getFormFieldOptions() {
    // defaultValue
    const value = this.$$form.getFieldValue(this.name);
    const defaultValue = isNil(value)
      ? (this.$props.sys?.defaultValue ?? this.property?.default)
      : undefined;
    // validators
    const validators = this._getFormFieldOptionsValidators();
    return Object.assign(
      {
        defaultValue,
      },
      this.$props.sys,
      {
        name: this.name,
        form: this.$$form.form,
        validators,
      },
    );
  }

  private _getFormFieldOptionsValidators() {
    const zodSchemaField = this.fieldZodSchema;
    const validators = this.$props.validators;
    const validateOnDynamicDefault =
      validators?.onDynamic === undefined &&
      validators?.onBlur === undefined &&
      validators?.onChange === undefined;
    const validateOnDynamic = validators?.onDynamic ?? validateOnDynamicDefault;
    const validateOnBlur = validators?.onBlur;
    const validateOnChange = validators?.onChange;
    return Object.assign(
      {},
      {
        onDynamic: _normalizeValidateSchema(validateOnDynamic, zodSchemaField),
        onBlur: _normalizeValidateSchema(validateOnBlur, zodSchemaField),
        onChange: _normalizeValidateSchema(validateOnChange, zodSchemaField),
      },
      this.$props.sys?.validators,
    );
  }
}

function _normalizeValidateSchema(
  validateSchema?: boolean | z.ZodType,
  zodSchemaField?: z.ZodType,
) {
  if (!validateSchema) return undefined;
  if (validateSchema === true) return zodSchemaField;
  return validateSchema;
}
