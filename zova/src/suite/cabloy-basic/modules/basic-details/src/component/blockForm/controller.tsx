import type { IComponentOptions } from 'zova';
import type { IResourceBlockOptionsBase, IJsxRenderContextPageEntry } from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { BeanControllerFormBase } from 'zova-module-a-form';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockForm'?: ControllerBlockFormProps;
  }
}

export interface ControllerBlockFormProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockForm extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  formRef: BeanControllerFormBase;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  protected render() {
    return null;
  }
}
