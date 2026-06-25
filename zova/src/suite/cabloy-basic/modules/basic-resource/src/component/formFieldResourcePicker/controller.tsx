import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions, IJsxRenderContextFormField } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase, ITableQuery } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { ZSelect, ZSelectProps } from 'zova-module-basic-select';
import { ModelResource } from 'zova-module-rest-resource';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'start-resource:formFieldResourcePicker'?: IResourceFormFieldResourcePickerOptions;
  }
}

export interface IResourceFormFieldResourcePickerOptions extends IResourceFormFieldOptionsBase {
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: ZSelectProps;
}

export interface ControllerFormFieldResourcePickerProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldResourcePickerOptions;
}

@Controller()
export class ControllerFormFieldResourcePicker extends BeanControllerBase {
  static $propsDefault = {
    options: { selectOptions: { itemValue: 'id', itemTitle: 'name' } },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  $$modelResource: ModelResource;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {
    const { ctx } = this.$$renderContext;
    // readonly
    if (this.$props.readonly) return;
    // modelResource
    this.$$modelResource = await ctx.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      this.resource,
    );
    // load data
    await $QueryAutoLoad(() => this.queryData);
  }

  get resource() {
    const resource = this.resourcePickerOptions?.resource;
    if (!resource) throw new Error('should specify resource name');
    return resource;
  }

  get resourcePickerOptions() {
    return this.$props.options;
  }

  get queryData() {
    return this.$$modelResource.selectGeneral(
      this.resourcePickerOptions?.actionPath,
      this.resourcePickerOptions?.query,
    );
  }

  get items() {
    return Array.isArray(this.queryData.data) ? this.queryData.data : this.queryData.data?.list;
  }

  protected render() {
    if (this.$props.readonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="basic-input:formFieldInput"
          options={{ value: this._getValueByRelation() }}
        ></ZFormFieldPreset>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const needClearableEmptyOption = !propsBucket.needHandleBorder;
          const className = needClearableEmptyOption
            ? classes(
                props.class,
                'grow w-full h-full min-h-0 border-0 rounded-none bg-transparent pl-0 pr-8 py-0 shadow-none outline-none focus:outline-none focus:shadow-none focus:border-0',
              )
            : classes(
                props.class,
                'select',
                !$$formField.field.state.meta.isValid && 'select-error',
              );
          const propsNew: ZSelectProps = {
            'modelValue': propsBucket.value,
            'onUpdate:modelValue': (value: any) => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'onBlur': () => {
              $$formField.handleBlur();
            },
            'items': this.items,
            ...this.$props.options?.selectOptions,
            ...propsBucket.options?.selectOptions,
            ...props,
            'class': className,
          };
          if (needClearableEmptyOption) {
            propsNew.items = this._ensureEmptyItemFallback(
              propsNew.items,
              propsNew.placeholder,
              true,
            );
            propsNew.placeholder = undefined;
          } else if (!propsNew.placeholder) {
            propsNew.items = this._ensureEmptyItemFallback(propsNew.items, undefined);
          }
          return <ZSelect {...propsNew}></ZSelect>;
        }}
      ></ZFormField>
    );
  }

  private _getValueByRelation() {
    const { $$form } = this.$$renderContext;
    let relationName = this.$props.options.relationName;
    if (!relationName) {
      relationName = this.$props.name!.substring(0, this.$props.name!.lastIndexOf('Id'));
    }
    const obj = $$form.getFieldValue(relationName);
    return obj?.[String(this.$props.options.selectOptions!.itemTitle)];
  }

  private _ensureEmptyItemFallback(
    items: any[] | undefined,
    placeholder: unknown,
    force = false,
  ): any[] | undefined {
    if (!items?.length) return items;
    const valueKey = String(this.$props.options.selectOptions!.itemValue);
    const titleKey = String(this.$props.options.selectOptions!.itemTitle);
    const emptyValue = '';
    if (items[0]?.[valueKey] === emptyValue) return items;
    if (!force && !!placeholder) return items;
    return [{ [valueKey]: emptyValue, [titleKey]: placeholder ?? '' }, ...items];
  }
}
