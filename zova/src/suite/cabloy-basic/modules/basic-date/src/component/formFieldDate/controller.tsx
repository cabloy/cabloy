import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';

import { ZDate } from '../../.metadata/component/date.js';
import { dateFormatUtil, dateInputTypeFromPreset } from '../../lib/utils.js';
import { TypeDateFormatPreset, TypeDateInputType } from '../../types/date.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-date:formFieldDate'?: IResourceFormFieldDateOptions;
  }
}

export interface IResourceFormFieldDateOptions extends IResourceFormFieldOptionsBase {
  preset?: TypeDateFormatPreset;
  format?: string;
  type?: TypeDateInputType;
}

export interface ControllerFormFieldDateProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDateOptions;
}

@Controller()
export class ControllerFormFieldDate extends BeanControllerBase {
  static $propsDefault = {
    options: {
      preset: 'DATETIME_SHORT',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  cContainer: string;

  protected async __init__() {
    this.cContainer = this.$style({ width: 'auto' });
  }

  protected render() {
    if (this.$props.readonly) {
      const value = dateFormatUtil(this.$props.value, this.dateOptions);
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="basic-input:formFieldInput"
          options={{ value }}
        ></ZFormFieldPreset>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        layout={{ class: this.cContainer }}
        slotDefault={({ propsBucket }, $$formField) => {
          return (
            <ZDate
              type={this.dateInputType}
              modelValue={propsBucket.value}
              onUpdate:modelValue={(value: Date | undefined) => {
                $$formField.setValue(value, propsBucket.disableNotifyChanged);
              }}
              onBlur={() => {
                $$formField.handleBlur();
              }}
            ></ZDate>
          );
        }}
      ></ZFormField>
    );
  }

  get dateOptions(): IResourceFormFieldDateOptions | undefined {
    return this.$props.options;
  }

  get dateInputType(): TypeDateInputType {
    return this.dateOptions?.type ?? dateInputTypeFromPreset(this.dateOptions?.preset);
  }
}
