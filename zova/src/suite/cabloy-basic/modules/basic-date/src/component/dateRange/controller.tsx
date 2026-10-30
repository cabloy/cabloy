import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerDateRangeProps {
  separator?: string;
}

export interface ControllerDateRangeModels {
  vModel?: string | undefined;
}

@Controller()
export class ControllerDateRange extends BeanControllerBase {
  static $propsDefault = { separator: '~' };

  private cSeparator: string;

  modelValue: string | undefined;

  protected async __init__() {
    this.modelValue = this.$useModel('modelValue');
    this.cSeparator = this.$style({
      width: '20px',
      flexShrink: 0,
      display: 'inline-block',
      textAlign: 'center',
    });
  }

  protected render() {
    const [dateStartStr, dateEndStr] = this._parseValue(this.modelValue);
    return (
      <div class="inline-flex min-w-0 max-w-full items-center">
        <input
          style={{ width: '130px', minWidth: 0 }}
          type="date"
          value={dateStartStr}
          onInput={e => {
            const value = (e.target as HTMLInputElement).value;
            this.modelValue = this._combineValue(value, dateEndStr);
          }}
        />
        <div class={this.cSeparator}>{this.$props.separator}</div>
        <input
          style={{ width: '130px', minWidth: 0 }}
          type="date"
          value={dateEndStr}
          onInput={e => {
            const value = (e.target as HTMLInputElement).value;
            this.modelValue = this._combineValue(dateStartStr, value);
          }}
        />
      </div>
    );
  }

  _parseValue(value?: string) {
    if (!value) return [];
    return value.split(this.$props.separator);
  }

  _combineValue(dateStartStr: string | undefined, dateEndStr: string | undefined) {
    if (!dateStartStr && !dateEndStr) return undefined;
    return `${dateStartStr ?? ''}${this.$props.separator}${dateEndStr ?? ''}`;
  }
}
