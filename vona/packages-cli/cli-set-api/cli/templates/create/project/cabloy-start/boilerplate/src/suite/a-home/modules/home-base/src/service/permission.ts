import type { IOpenapiPermissions, IResourceRecord } from 'vona-module-a-openapi';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServicePermission extends BeanBase {
  async retrievePermissions(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    return await this.bean.permission.retrievePermissions(resource);
  }
}
