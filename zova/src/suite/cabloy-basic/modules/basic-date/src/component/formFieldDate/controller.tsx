import type { IComponentOptions } from 'zova';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormFieldPreset, type IFormFieldComponentOptions } from 'zova-module-a-form';

import { dateFormatUtil } from '../../lib/utils.js';
import { TypeDateFormatPreset } from '../../types/date.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-date:formFieldDate'?: IResourceFormFieldDateOptions;
  }
}

export interface IResourceFormFieldDateOptions extends IResourceFormFieldOptionsBase {
  preset?: TypeDateFormatPreset;
  format?: string;
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

  protected async __init__() {}

  protected render() {
    const value = dateFormatUtil(this.$props.value, this.dateFormat);
    return (
      <ZFormFieldPreset
        {...this.$props}
        render="basic-input:formFieldInput"
        options={{ value }}
      ></ZFormFieldPreset>
    );
  }

  get dateFormat(): IResourceFormFieldDateOptions | undefined {
    return this.$props.options;
  }
}
