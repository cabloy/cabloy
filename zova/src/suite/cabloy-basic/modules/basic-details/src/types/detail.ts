import { IDetailScope } from 'zova-module-a-openapi';
import 'zova-module-a-form';
import 'zova-module-a-openapi';
import type { ServiceDetail } from '../service/detail.jsx';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextDetail<TData extends {} = {}> {
    $$detail: ServiceDetail<TData>;
  }

  export interface IDetailScope {
    $$detail?: ServiceDetail;
  }
}

declare module 'zova-module-a-form' {
  export interface IFormScope extends IDetailScope {}
}
