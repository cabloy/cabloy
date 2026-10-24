import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { IResourcePickerPageContext } from '../../page/resourcePicker/controller.tsx';

import { resourcePickerPageContextKey } from '../../lib/resourcePicker.ts';

export interface ControllerResourcePickerContextProps {
  context: IResourcePickerPageContext;
}

@Controller()
export class ControllerResourcePickerContext extends BeanControllerBase {
  static $propsDefault = {};

  protected async __init__() {
    this.bean._setBean(
      resourcePickerPageContextKey,
      (this.$props as ControllerResourcePickerContextProps).context,
    );
  }

  protected render() {
    return this.$slotDefault?.();
  }
}
