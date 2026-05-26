import type { Next } from 'vona';
import type { IDecoratorInterceptorOptionsGlobal, IInterceptorExecute } from 'vona-module-a-aspect';

import { BeanBase, Global } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

import type { TypeDatasourceType } from '../types/datasharding.ts';

export interface IInterceptorOptionsDatasharding extends IDecoratorInterceptorOptionsGlobal {
  datasourceType: TypeDatasourceType;
  cacheDatasourceWrite: boolean;
}

@Interceptor<IInterceptorOptionsDatasharding>({
  dependents: 'a-openapischema:openapiSchema',
  datasourceType: 'auto',
  cacheDatasourceWrite: true,
})
@Global()
export class InterceptorDatasharding extends BeanBase implements IInterceptorExecute {
  async execute(options: IInterceptorOptionsDatasharding, next: Next) {
    return await this.bean.datasharding.switchDatasource(next, {
      datasourceType: options.datasourceType,
      cacheDatasourceWrite: options.cacheDatasourceWrite,
    });
  }
}
