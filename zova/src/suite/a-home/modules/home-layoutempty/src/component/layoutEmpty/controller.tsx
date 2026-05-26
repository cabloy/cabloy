import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZRouterViewEmpty } from 'zova-module-a-router';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

export interface ControllerLayoutEmptyProps {}

@Controller()
export class ControllerLayoutEmpty extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ init: { arg: { sidebarLeftOpenPC: false } as IServiceSsrLayoutOptions } })
  $$serviceSsrLayout: ServiceSsrLayout;

  protected render() {
    return <ZRouterViewEmpty></ZRouterViewEmpty>;
  }
}
