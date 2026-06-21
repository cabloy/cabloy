import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-detail:formFieldDetails'?: IResourceFormFieldDetailsOptions;
  }
}

export interface IResourceFormFieldDetailsOptions extends IResourceFormFieldOptionsBase {}

export interface ControllerFormFieldDetailsProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDetailsOptions;
}

@Controller()
export class ControllerFormFieldDetails extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket }, _$$formField) => {
          console.log(propsBucket.value);
          return <div>ssss details</div>;
        }}
      ></ZFormField>
    );
  }
}
