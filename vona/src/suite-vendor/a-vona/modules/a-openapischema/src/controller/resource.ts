import type {
  IDecoratorControllerOptions,
  IRecordResourceNameToRoutePathItem,
} from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, recordResourceNameToRoutePath, Web } from 'vona-module-a-web';

import { DtoBootstrap } from '../dto/bootstrap.tsx';

export interface IControllerOptionsResource extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsResource>('resource', { exclude: true })
export class ControllerResource extends BeanBase {
  @Web.get('bootstrap/:resource')
  @Passport.public()
  bootstrap(@Arg.param('resource') resource: string): DtoBootstrap {
    // apiPath
    const routePathInfo: IRecordResourceNameToRoutePathItem =
      recordResourceNameToRoutePath[resource];
    if (!routePathInfo) throw new Error(`not found routePath of resource: ${resource}`);
    const apiPath = routePathInfo.apiPath;
    return { apiPath };
  }
}
