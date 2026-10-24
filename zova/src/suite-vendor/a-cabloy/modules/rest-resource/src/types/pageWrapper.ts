import type { ControllerPageResource } from '../page/resource/controller.tsx';
import 'zova-module-a-openapi';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextPageWrapper {
    $$pageWrapper: ControllerPageResource;
  }
}
