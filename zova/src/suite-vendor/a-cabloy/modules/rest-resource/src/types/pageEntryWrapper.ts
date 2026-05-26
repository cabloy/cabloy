import type { ControllerPageEntry } from '../page/entry/controller.jsx';
import 'zova-module-a-openapi';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextPageEntryWrapper {
    $$pageEntryWrapper: ControllerPageEntry;
  }
}
