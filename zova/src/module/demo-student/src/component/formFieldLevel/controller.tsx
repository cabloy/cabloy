import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'demo-student:formFieldLevel'?: IResourceFormFieldLevelOptions;
  }
}

export interface IResourceFormFieldLevelItem {
  value?: any;
  title?: string;
}

export interface IResourceFormFieldLevelOptions extends IResourceFormFieldOptionsBase {
  items?: IResourceFormFieldLevelItem[];
  itemValue?: string;
  itemTitle?: string;
  placeholder?: string;
}

export interface ControllerFormFieldLevelProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldLevelOptions;
}

@Controller()
export class ControllerFormFieldLevel extends BeanControllerBase {
  static $propsDefault = {
    options: {
      itemValue: 'value',
      itemTitle: 'title',
    },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    const propsFormField = this.$props as ControllerFormFieldLevelProps;
    return (
      <ZFormField
        {...propsFormField}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const items = propsBucket.options.items ?? [];
          const value = propsBucket.value;
          const itemSelected = items.find(
            item => String(item[String(propsBucket.options.itemValue)]) === String(value),
          );
          if (propsBucket.readonly) {
            return (
              <div class={classes('flex min-h-12 items-center', props.class)}>
                <span
                  class={classes(
                    'badge badge-lg font-semibold border-0 px-4 py-3 tracking-wide',
                    this._getBadgeClass(value),
                  )}
                >
                  {itemSelected?.[String(propsBucket.options.itemTitle)] ??
                    propsBucket.options.placeholder ??
                    ''}
                </span>
              </div>
            );
          }
          return (
            <div class={classes('flex flex-wrap gap-2', props.class)}>
              {items.map(item => {
                const itemValue = item[String(propsBucket.options.itemValue)];
                const selected = String(itemValue) === String(value);
                return (
                  <button
                    key={String(itemValue)}
                    type="button"
                    class={classes(
                      'btn btn-sm rounded-full border-0 px-4 font-medium transition-colors',
                      selected
                        ? this._getButtonClass(itemValue)
                        : 'btn-outline text-base-content/70',
                      !$$formField.field.state.meta.isValid && 'btn-error',
                    )}
                    onClick={() => {
                      $$formField.setValue(itemValue, propsBucket.disableNotifyChanged);
                      $$formField.handleBlur();
                    }}
                  >
                    {item[String(propsBucket.options.itemTitle)]}
                  </button>
                );
              })}
            </div>
          );
        }}
      ></ZFormField>
    );
  }

  private _getBadgeClass(value: unknown) {
    if (String(value) === '1') return 'badge-warning text-warning-content';
    if (String(value) === '2') return 'badge-info text-info-content';
    if (String(value) === '3') return 'badge-success text-success-content';
    return 'badge-neutral text-neutral-content';
  }

  private _getButtonClass(value: unknown) {
    if (String(value) === '1') return 'btn-warning text-warning-content';
    if (String(value) === '2') return 'btn-info text-info-content';
    if (String(value) === '3') return 'btn-success text-success-content';
    return 'btn-neutral text-neutral-content';
  }
}
