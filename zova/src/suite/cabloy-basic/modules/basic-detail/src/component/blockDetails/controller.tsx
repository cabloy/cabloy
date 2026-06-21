import { BeanControllerBase, IComponentOptions } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { IResourceBlockOptionsBase } from 'zova-module-a-openapi';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-detail:blockDetails'?: ControllerBlockDetailsProps;
  }
}

export interface ControllerBlockDetailsProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockDetails extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    return null;
  }
}
