import type { IComponentOptions } from 'zova';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { CurrencyOptions } from '@zhennann/currency';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  ControllerForm,
  ZFormFieldPreset,
  type IFormFieldComponentOptions,
} from 'zova-module-a-form';

import { currencyFormat, currencyUpdate } from '../../lib/utils.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-currency:formFieldCurrency'?: IResourceFormFieldCurrencyOptions;
  }
}

export interface IResourceFormFieldCurrencyOptions
  extends IResourceFormFieldOptionsBase, CurrencyOptions {}

export interface ControllerFormFieldCurrencyProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldCurrencyOptions;
}

@Controller()
export class ControllerFormFieldCurrency extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private _valueKeyboardInput: string | undefined;

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm;

  protected async __init__() {}

  protected render() {
    const currencyOptions = this.$props.options;
    const value = this._valuePatch(currencyOptions);
    return (
      <ZFormFieldPreset
        {...this.$props}
        render="basic-input:formFieldInput"
        options={{
          value,
          onInput: (e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            this._valueKeyboardInput = value;
            // valuePatch maybe null
            const valuePatch = currencyUpdate(value, currencyOptions);
            const valueNew = valuePatch !== undefined ? (valuePatch ?? undefined) : value;
            this.$$form.setFieldValue(this.$props.name!, valueNew);
          },
          onChange: (e: Event) => {
            if (this._valueKeyboardInput !== undefined) {
              const value = (e.target as HTMLInputElement).value;
              const valueInputPatch = currencyUpdate(value, currencyOptions);
              if (valueInputPatch !== undefined) {
                this._valueKeyboardInput = undefined;
              }
            }
          },
        }}
      ></ZFormFieldPreset>
    );
  }

  private _valuePatch(currencyOptions?: CurrencyOptions) {
    if (this._valueKeyboardInput === undefined) return this._getValue(currencyOptions);
    // hold the current input value if invalid
    const valueInputPatch = currencyUpdate(this._valueKeyboardInput, currencyOptions);
    if (valueInputPatch === undefined) return this._valueKeyboardInput;
    // hold the current input value if equal
    if (valueInputPatch === this.$props.value) return this._valueKeyboardInput;
    // default
    return this._getValue(currencyOptions);
  }

  private _getValue(currencyOptions?: CurrencyOptions) {
    return currencyFormat(this.$props.value, currencyOptions);
  }
}
