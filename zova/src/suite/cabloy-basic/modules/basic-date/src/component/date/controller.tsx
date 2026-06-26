import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { TypeDateInputType } from '../../types/date.js';

import { dateFromInputValue, dateToInputValue } from '../../lib/utils.js';

export interface ControllerDateProps {
  type?: TypeDateInputType;
  onBlur?: () => void;
}

export interface ControllerDateModels {
  vModel?: any;
}

@Controller()
export class ControllerDate extends BeanControllerBase {
  static $propsDefault = { type: 'date' as TypeDateInputType };

  modelValue?: any;

  protected async __init__() {
    this.modelValue = this.$useModel('modelValue');
  }

  protected render() {
    const { type, onBlur } = this.$props as ControllerDateProps;
    return (
      <input
        type={type}
        step={type === 'date' ? undefined : 1}
        value={dateToInputValue(this.modelValue, type)}
        onInput={e => {
          const value = (e.target as HTMLInputElement).value;
          this.modelValue = dateFromInputValue(value, type);
        }}
        onBlur={() => {
          onBlur?.();
        }}
      />
    );
  }
}
