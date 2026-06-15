import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { ZSelect, type ZSelectProps } from 'zova-module-basic-select';

export interface IResourceFormFieldLevelOptions extends IResourceFormFieldOptionsBase, ZSelectProps {
  helper?: string;
}

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'demo-student:formFieldLevel'?: IResourceFormFieldLevelOptions;
  }
}

export interface ControllerFormFieldLevelProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldLevelOptions;
}

@Controller()
export class ControllerFormFieldLevel extends BeanControllerBase {
  static $propsDefault = {
    options: {
      itemValue: 'value',
      itemTitle: 'title',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    if (this.$props.readonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="basic-input:formFieldInput"
          options={{ value: this._getValueByItems() }}
        ></ZFormFieldPreset>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const className = !propsBucket.needHandleBorder
            ? classes(props.class, 'select select-ghost bg-info/10 font-medium')
            : classes(
                props.class,
                'select bg-info/10 font-medium',
                !$$formField.field.state.meta.isValid && 'select-error',
              );
          const propsNew: ZSelectProps = {
            modelValue: propsBucket.value,
            'onUpdate:modelValue': (value: any) => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            ...propsBucket.options,
            ...props,
            class: className,
          };
          propsNew.items = this._ensureEmptyItem(propsNew.items);
          const domSelect = <ZSelect {...propsNew}></ZSelect>;
          if (!this.$props.options.helper) return domSelect;
          return (
            <div class="flex flex-col gap-1">
              {domSelect}
              <div class="text-xs text-info">{this.$props.options.helper}</div>
            </div>
          );
        }}
      ></ZFormField>
    );
  }

  private _ensureEmptyItem(items: any[] | undefined) {
    if (!items?.length) return items;
    const valueKey = String(this.$props.options.itemValue);
    const titleKey = String(this.$props.options.itemTitle);
    if (items[0]?.[valueKey] === undefined) return items;
    return [{ [valueKey]: undefined, [titleKey]: '' }, ...items];
  }

  private _getValueByItems() {
    const value = this.$props.value;
    const item = this.$props.options.items?.find(
      item => String(item[String(this.$props.options.itemValue)]) === String(value),
    );
    return item?.[String(this.$props.options.itemTitle)];
  }
}
