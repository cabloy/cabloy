import { IJsxRenderContextBase } from '../action.js';

export interface IDetailScope {}

export interface IJsxRenderContextDetail extends IJsxRenderContextBase {
  $celScope: IDetailScope;
}
