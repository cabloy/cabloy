import type { IPageEntryScope } from 'zova-module-a-openapi';

import 'zova-module-a-form';
import 'zova-module-a-openapi';
import { ControllerBlockPageEntry } from '../component/blockPageEntry/controller.jsx';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextPageEntry<TData extends {} = {}> {
    $$pageEntry: ControllerBlockPageEntry<TData>;
  }
}

declare module 'zova-module-a-form' {
  export interface IFormScope extends IPageEntryScope {}
}
