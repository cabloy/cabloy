import type { IOpenapiPermissions, IResourceRecord } from 'vona-module-a-openapi';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { DtoPermissions } from 'vona-module-a-permission';
import { Arg, Controller, Web } from 'vona-module-a-web';
import z from 'zod';

export interface IControllerOptionsPermission extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPermission>('permission')
export class ControllerPermission extends BeanBase {
  @Web.get(':resource')
  @Api.body(v.object(DtoPermissions))
  async retrievePermissions(
    @Arg.param('resource', z.string()) resource: keyof IResourceRecord,
  ): Promise<IOpenapiPermissions> {
    return await this.scope.service.permission.retrievePermissions(resource);
  }
}
