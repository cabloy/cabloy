import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZRouterViewEmpty } from 'zova-module-a-router';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

export interface ControllerLayoutEmptyProps {}

@Controller()
export class ControllerLayoutEmpty extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    const sidebar = this.scope.config.layout.sidebar;
    return usePrepareArg({
      bodyReadyObserver: sidebar.bodyReadyObserver,
      sidebarLeftOpenPCCapability: sidebar.leftOpenPCCapability,
    } satisfies IServiceSsrLayoutOptions);
  }

  protected render() {
    return <ZRouterViewEmpty></ZRouterViewEmpty>;
  }
}
