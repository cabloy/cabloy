import { IJsxRenderContextBase } from '../action.ts';
import { IFormMeta } from '../formMeta.ts';

export interface IDetailScope {
  formMeta?: IFormMeta;
}

export interface IJsxRenderContextDetail extends IJsxRenderContextBase {
  $celScope: IDetailScope;
}
