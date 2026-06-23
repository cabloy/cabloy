import { IJsxRenderContextBase } from '../action.js';
import { IFormMeta } from '../formMeta.js';

export interface IDetailsScope {
  formMeta?: IFormMeta;
}

export interface IJsxRenderContextDetails extends IJsxRenderContextBase {
  $celScope: IDetailsScope;
}
