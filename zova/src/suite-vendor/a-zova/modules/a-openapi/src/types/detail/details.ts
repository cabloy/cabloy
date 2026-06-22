import { ControllerBlockDetails } from 'zova-module-basic-details';

import { IJsxRenderContextBase } from '../action.js';
import { IFormMeta } from '../formMeta.js';

export interface IDetailsScope {
  formMeta?: IFormMeta;
  $$details?: ControllerBlockDetails<any>;
}

export interface IJsxRenderContextDetails extends IJsxRenderContextBase {
  $celScope: IDetailsScope;
}
