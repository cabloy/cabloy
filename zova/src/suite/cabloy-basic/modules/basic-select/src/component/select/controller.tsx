import { isNil } from '@cabloy/utils';
import { VNode } from 'vue';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerSelectProps {
  placeholder?: string;
  items?: any[] | undefined;
  itemTitle?: string;
  itemValue?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export interface ControllerSelectModels {
  vModel?: any;
}

@Controller()
export class ControllerSelect extends BeanControllerBase {
  static $propsDefault = {
    itemValue: 'value',
    itemTitle: 'title',
  };

  modelValue?: any;

  protected async __init__() {
    this.modelValue = this.$useModel('modelValue');
  }

  protected render() {
    const {
      items,
      itemTitle,
      itemValue,
      placeholder,
      modelValue,
      controllerRef,
      onChange,
      onBlur,
      'onUpdate:modelValue': _onUpdateModelValue,
      ...props
    } = this.$props as any;
    const domOptions: VNode[] = [];
    if (items) {
      for (const item of items) {
        const title = item[itemTitle];
        const value = item[itemValue];
        domOptions.push(
          <option key={value} value={value} selected={String(this.modelValue) === String(value)}>
            {title}
          </option>,
        );
      }
    }
    return (
      <select
        {...props}
        onChange={(e: Event) => {
          const selectedValue = (e.target as HTMLSelectElement).value;
          const item = items?.find(item => String(item[itemValue]) === selectedValue);
          const value = item ? item[itemValue] : undefined;
          this.modelValue = value;
          onChange?.(e);
        }}
        onBlur={(e: Event) => {
          onBlur?.(e);
        }}
      >
        {!!placeholder && (
          <option disabled={true} selected={isNil(this.modelValue)}>
            {placeholder}
          </option>
        )}
        {domOptions}
      </select>
    );
  }
}
