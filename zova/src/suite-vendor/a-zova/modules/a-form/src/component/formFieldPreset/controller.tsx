import { BeanControllerBase, IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ISchemaRenderComponentPresetRecord } from 'zova-module-a-openapi';

import type { ControllerForm } from '../form/controller.jsx';

import { IFormFieldPresetOptions } from '../../types/formField.js';

export interface ControllerFormFieldPresetProps<
  PresetName extends keyof ISchemaRenderComponentPresetRecord = never,
> extends IFormFieldPresetOptions<PresetName> {}

@Controller()
export class ControllerFormFieldPreset extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$form: ControllerForm;

  protected async __init__() {}

  protected render() {
    const name = this.$props.name;
    if (!name) throw new Error(`should specify field name`);
    return this.$$form.renderField(name, this.$props as any);
  }
}
