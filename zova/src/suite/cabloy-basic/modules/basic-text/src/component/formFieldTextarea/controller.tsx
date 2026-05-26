import type { IComponentOptions } from 'zova';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, type IFormFieldComponentOptions } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-text:formFieldTextarea'?: IResourceFormFieldTextareaOptions;
  }
}

export interface IResourceFormFieldTextareaOptions extends IResourceFormFieldOptionsBase {
  cols?: number;
  rows?: number;
  value?: any;
  placeholder?: string;
  onChange?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export interface ControllerFormFieldTextareaProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldTextareaOptions;
}

@Controller()
export class ControllerFormFieldTextarea extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    <ZFormField
      {...this.$props}
      slotDefault={({ propsBucket, props }, $$formField) => {
        const className = !propsBucket.needHandleBorder
          ? classes(props.class, 'textarea textarea-ghost')
          : classes(
              props.class,
              'textarea',
              !$$formField.field.state.meta.isValid && 'textarea-error',
            );
        const propsNew: Omit<IResourceFormFieldTextareaOptions, 'style'> = {
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
        return <textarea {...propsNew}></textarea>;
      }}
    ></ZFormField>;
  }
}
