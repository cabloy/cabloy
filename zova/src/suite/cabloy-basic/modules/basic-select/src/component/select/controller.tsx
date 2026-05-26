import { isNil } from '@cabloy/utils';
import { VNode } from 'vue';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerSelectProps {
  placeholder?: string;
  items?: any[] | undefined;
  itemTitle?: string;
  itemValue?: string;
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
    const domOptions: VNode[] = [];
    if (this.$props.items) {
      for (const item of this.$props.items) {
        const title = item[this.$props.itemTitle];
        const value = item[this.$props.itemValue];
        domOptions.push(
          <option key={value} value={value} selected={String(this.modelValue) === String(value)}>
            {title}
          </option>,
        );
      }
    }
    return (
      <select
        onChange={(e: Event) => {
          const selectedValue = (e.target as HTMLSelectElement).value;
          const item = this.$props.items?.find(
            item => String(item[this.$props.itemValue]) === selectedValue,
          );
          const value = item ? item[this.$props.itemValue] : undefined;
          this.modelValue = value;
        }}
      >
        {!!this.$props.placeholder && (
          <option disabled={true} selected={isNil(this.modelValue)}>
            {this.$props.placeholder}
          </option>
        )}
        {domOptions}
      </select>
    );
  }
}
