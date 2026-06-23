import { IJsxRenderContextBase } from '../action.js';
import { IFormMeta } from '../formMeta.js';

export interface IDetailScope {
  formMeta?: IFormMeta;
}

export interface IJsxRenderContextDetail extends IJsxRenderContextBase {
  $celScope: IDetailScope;
}
