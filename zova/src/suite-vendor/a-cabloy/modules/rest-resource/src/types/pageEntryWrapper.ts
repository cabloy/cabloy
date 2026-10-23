import type { ControllerPageEntry } from '../page/entry/controller.tsx';
import 'zova-module-a-openapi';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextPageEntryWrapper {
    $$pageEntryWrapper: ControllerPageEntry;
  }
}
