import type { IComponentOptions } from 'zova';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  type HTMLInputElementType,
  ZFormField,
  type IFormFieldComponentOptions,
} from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-input:formFieldInput'?: IResourceFormFieldInputOptions;
  }
}

export interface IResourceFormFieldInputOptions extends IResourceFormFieldOptionsBase {
  value?: any;
  type?: HTMLInputElementType;
  placeholder?: string;
  onChange?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export interface ControllerFormFieldInputProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldInputOptions;
}

@Controller()
export class ControllerFormFieldInput extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const className = !propsBucket.needHandleBorder
            ? props.class
            : classes(props.class, 'input', !$$formField.field.state.meta.isValid && 'input-error');
          const propsNew: Omit<IResourceFormFieldInputOptions, 'style'> = {
            type: 'text',
            placeholder: undefined,
            onInput: (e: Event) => {
              $$formField.setValue(
                (e.target as HTMLInputElement).value,
                propsBucket.disableNotifyChanged,
              );
            },
            onBlur: () => {
              $$formField.handleBlur();
            },
            value: propsBucket.value,
            ...propsBucket.options,
            ...props,
            class: className,
          };
          return <input {...propsNew}></input>;
        }}
      ></ZFormField>
    );
  }
}
