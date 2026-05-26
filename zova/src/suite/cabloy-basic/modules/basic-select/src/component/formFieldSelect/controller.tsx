import type { IComponentOptions } from 'zova';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset, type IFormFieldComponentOptions } from 'zova-module-a-form';

import { ZSelect, ZSelectProps } from '../../.metadata/component/select.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-select:formFieldSelect'?: IResourceFormFieldSelectOptions;
  }
}

export interface IResourceFormFieldSelectOptions
  extends IResourceFormFieldOptionsBase, ZSelectProps {}

export interface ControllerFormFieldSelectProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldSelectOptions;
}

@Controller()
export class ControllerFormFieldSelect extends BeanControllerBase {
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
          render={'basic-input:formFieldInput'}
          options={{ value: this._getValueByItems() }}
        ></ZFormFieldPreset>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const className = !propsBucket.needHandleBorder
            ? classes(props.class, 'select select-ghost')
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
            ...propsBucket.options,
            ...props,
            'class': className,
          };
          return <ZSelect {...propsNew}></ZSelect>;
        }}
      ></ZFormField>
    );
  }

  private _getValueByItems() {
    const value = this.$props.value;
    const item = this.$props.options.items?.find(
      item => String(item[String(this.$props.options.itemValue)]) === String(value),
    );
    return item?.[String(this.$props.options.itemTitle)];
  }
}
