import type { IPageScope } from 'zova-module-a-openapi';

import 'zova-module-a-form';
import 'zova-module-a-table';
import 'zova-module-a-openapi';
import { ControllerBlockFilter } from '../component/blockFilter/controller.jsx';
import { ControllerBlockPage } from '../component/blockPage/controller.jsx';

export interface IPageFilterScope extends IPageScope {
  $$filter?: ControllerBlockFilter;
}

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextPage<TData extends {} = {}> {
    $$page: ControllerBlockPage<TData>;
  }
}

declare module 'zova-module-a-form' {
  export interface IFormScope extends IPageScope, IPageFilterScope {}
}

declare module 'zova-module-a-table' {
  export interface ITableScope extends IPageScope {}
}
