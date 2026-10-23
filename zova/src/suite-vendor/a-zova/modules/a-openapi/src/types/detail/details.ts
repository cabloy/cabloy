import { IJsxRenderContextBase } from '../action.ts';
import { IFormMeta } from '../formMeta.ts';

export interface IDetailsScope {
  formMeta?: IFormMeta;
}

export interface IJsxRenderContextDetails extends IJsxRenderContextBase {
  $celScope: IDetailsScope;
}
