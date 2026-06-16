import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';
import type { ZSelectProps } from 'zova-module-basic-select';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { ZSelect } from 'zova-module-basic-select';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'demo-student:formFieldLevel'?: IResourceFormFieldLevelOptions;
  }
}

export interface IResourceFormFieldLevelOptions
  extends IResourceFormFieldOptionsBase, ZSelectProps {
  helper?: string;
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
    if (this.$props.readonly) {
      return (
        <>
          <ZFormFieldPreset
            {...this.$props}
            render="basic-input:formFieldInput"
            options={{ value: this._getValueByItems(this.$props.value) }}
          ></ZFormFieldPreset>
          {this._renderHint(this.$props.value)}
        </>
      );
    }
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const className = !propsBucket.needHandleBorder
            ? classes(props.class, 'select select-primary select-ghost font-medium')
            : classes(
                props.class,
                'select select-primary font-medium',
                !$$formField.field.state.meta.isValid && 'select-error',
              );
          const propsNew: ZSelectProps = {
            modelValue: propsBucket.value,
            'onUpdate:modelValue': (value: any) => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            ...propsBucket.options,
            ...props,
            class: className,
          };
          propsNew.items = this._ensureEmptyItemFallback(propsNew.items, propsNew.placeholder);
          return (
            <div class="flex flex-col gap-2 w-full">
              <ZSelect {...propsNew}></ZSelect>
              {this._renderHint(propsBucket.value)}
            </div>
          );
        }}
      ></ZFormField>
    );
  }

  private _renderHint(value: unknown) {
    const helper = this.$props.options?.helper;
    const title = this._getValueByItems(value);
    if (!helper && !title) return null;
    return (
      <div class="flex items-center gap-2 pl-1 text-xs text-base-content/70">
        {title && <span class={this._getBadgeClass(value)}>{title}</span>}
        {helper && <span>{helper}</span>}
      </div>
    );
  }

  private _ensureEmptyItemFallback(items: any[] | undefined, placeholder: unknown) {
    if (!!placeholder || !items?.length) return items;
    const valueKey = String(this.$props.options?.itemValue);
    const titleKey = String(this.$props.options?.itemTitle);
    if (items[0]?.[valueKey] === undefined) return items;
    return [{ [valueKey]: undefined, [titleKey]: '' }, ...items];
  }

  private _getValueByItems(value: unknown) {
    const item = this.$props.options?.items?.find(
      item => String(item[String(this.$props.options?.itemValue)]) === String(value),
    );
    return item?.[String(this.$props.options?.itemTitle)];
  }

  private _getBadgeClass(value: unknown) {
    return classes(
      'badge badge-sm font-medium whitespace-nowrap',
      this._getBadgeTone(value),
    );
  }

  private _getBadgeTone(value: unknown) {
    switch (String(value)) {
      case '1':
        return 'badge-neutral';
      case '2':
        return 'badge-info';
      case '3':
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  }
}
