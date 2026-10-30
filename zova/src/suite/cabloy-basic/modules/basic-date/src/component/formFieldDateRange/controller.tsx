import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

import { ZDateRange } from '../../.metadata/component/dateRange.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-date:formFieldDateRange'?: IResourceFormFieldDateRangeOptions;
  }
}

export interface IResourceFormFieldDateRangeOptions extends IResourceFormFieldOptionsBase {
  separator?: string;
}

export interface ControllerFormFieldDateRangeProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDateRangeOptions;
}

@Controller()
export class ControllerFormFieldDateRange extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  cContainer: string;

  protected async __init__() {
    this.cContainer = this.$style({
      width: 'auto',
      maxWidth: '100%',
      $nest: {
        '&.input': {
          height: 'auto',
          minHeight: 'var(--size)',
          flexWrap: 'wrap',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        },
      },
    });
  }

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        layout={{ class: this.cContainer }}
        slotDefault={({ propsBucket }, $$formField) => {
          return (
            <ZDateRange
              separator={this.$props.options?.separator}
              modelValue={propsBucket.value}
              onUpdate:modelValue={value => {
                $$formField.setValue(value);
              }}
            ></ZDateRange>
          );
        }}
      ></ZFormField>
    );
  }
}
