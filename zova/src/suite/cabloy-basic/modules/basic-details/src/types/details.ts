import 'zova-module-a-table';
import 'zova-module-a-openapi';
import type { IDetailsScope, IPermissionHintGeneral } from 'zova-module-a-openapi';

import { ControllerBlockDetails } from '../component/blockDetails/controller.jsx';

export type TypeDetailsCheckPermission = (
  actionName?: string,
  permissionHint?: IPermissionHintGeneral,
) => boolean;

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextDetails<TData extends {} = {}> {
    $$details: ControllerBlockDetails<TData>;
  }

  export interface IDetailsScope {
    $$details?: ControllerBlockDetails<any>;
  }
}

declare module 'zova-module-a-table' {
  export interface ITableScope extends IDetailsScope {}
}
