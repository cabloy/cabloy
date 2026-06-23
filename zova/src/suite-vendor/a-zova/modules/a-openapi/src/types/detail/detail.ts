import { ControllerBlockDetails } from 'zova-module-basic-details';

import { IJsxRenderContextBase } from '../action.js';

export interface IDetailScope {
  $$detail?: ControllerBlockDetails<any>;
}

export interface IJsxRenderContextDetail extends IJsxRenderContextBase {
  $celScope: IDetailScope;
}
