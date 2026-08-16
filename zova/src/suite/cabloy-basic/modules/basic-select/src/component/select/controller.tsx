import { isNil } from '@cabloy/utils';
import { VNode } from 'vue';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { isSelectValueEqual } from '../../lib/utils.js';

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
      style,
      'onUpdate:modelValue': _onUpdateModelValue,
      ...props
    } = this.$props as any;
    const selectBackgroundColor = style?.backgroundColor ?? 'var(--color-base-100)';
    const selectColor = style?.color ?? 'var(--color-base-content)';
    const optionStyle = {
      backgroundColor: selectBackgroundColor,
      color: selectColor,
    };
    const placeholderOptionStyle = {
      backgroundColor: selectBackgroundColor,
      color: `color-mix(in oklch, ${selectColor} 60%, transparent)`,
    };
    const selectStyle = {
      ...style,
      colorScheme: this.$theme.dark ? 'dark' : 'light',
      backgroundColor: selectBackgroundColor,
      color: selectColor,
    };
    const domOptions: VNode[] = [];
    let modelValueDom = '';
    if (items) {
      for (const item of items) {
        const title = item[itemTitle];
        const value = item[itemValue];
        const valueDom = isNil(value) ? '' : String(value);
        const selected = isSelectValueEqual(value, this.modelValue);
        if (selected) modelValueDom = valueDom;
        domOptions.push(
          <option key={valueDom} value={valueDom} selected={selected} style={optionStyle}>
            {title}
          </option>,
        );
      }
    }
    return (
      <select
        {...props}
        value={modelValueDom}
        style={selectStyle}
        onChange={(e: Event) => {
          const selectedValue = (e.target as HTMLSelectElement).value;
          const item = items?.find(item => {
            const value = item[itemValue];
            const valueDom = isNil(value) ? '' : String(value);
            return valueDom === selectedValue;
          });
          const value = selectedValue === '' ? undefined : item?.[itemValue];
          this.modelValue = value;
          onChange?.(e);
        }}
        onBlur={(e: Event) => {
          onBlur?.(e);
        }}
      >
        {!!placeholder && (
          <option disabled={true} selected={isNil(this.modelValue)} style={placeholderOptionStyle}>
            {placeholder}
          </option>
        )}
        {domOptions}
      </select>
    );
  }
}
