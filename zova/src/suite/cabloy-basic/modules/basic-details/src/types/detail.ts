import { IDetailScope } from 'zova-module-a-openapi';
import 'zova-module-a-form';
import 'zova-module-a-openapi';

import type { ServiceDetail } from '../service/detail.tsx';
import type { TypeDetailsCheckPermission } from './details.ts';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextDetail<TData extends {} = {}> {
    $$detail: ServiceDetail<TData>;
  }

  export interface IDetailScope {
    $$detail?: ServiceDetail;
    checkPermission?: TypeDetailsCheckPermission;
  }
}

declare module 'zova-module-a-form' {
  export interface IFormScope extends IDetailScope {}
}
