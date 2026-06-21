import 'zova-module-a-openapi';
import { ControllerBlockDetails } from '../component/blockDetails/controller.jsx';

declare module 'zova-module-a-openapi' {
  export interface IJsxRenderContextDetails<TData extends {} = {}> {
    $$details: ControllerBlockDetails<TData>;
  }
}
