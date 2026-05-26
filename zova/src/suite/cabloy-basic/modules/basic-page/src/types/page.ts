import type { IPageScope } from 'zova-module-a-openapi';

import 'zova-module-a-table';
import 'zova-module-a-openapi';
import { ControllerBlockPage } from '../component/blockPage/controller.jsx';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextPage<TData extends {} = {}> {
    $$page: ControllerBlockPage<TData>;
  }
}

declare module 'zova-module-a-table' {
  export interface ITableScope extends IPageScope {}
}
