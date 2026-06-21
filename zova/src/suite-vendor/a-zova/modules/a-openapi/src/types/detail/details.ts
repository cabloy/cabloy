import { IJsxRenderContextBase } from '../action.js';

export interface IDetailsScope {}

export interface IJsxRenderContextDetails extends IJsxRenderContextBase {
  $celScope: IDetailsScope;
}
