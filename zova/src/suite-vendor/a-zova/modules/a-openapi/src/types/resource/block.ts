import { types } from 'typestyle';
import { TypeRenderComponentJsx } from 'zova-jsx';

export interface IResourceBlockRecord {}

export interface IResourceBlockOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
}

export interface IResourceRenderBlockOptionsBlock {
  render?: keyof IResourceBlockRecord | TypeRenderComponentJsx;
  options?: IResourceBlockOptionsBase;
}
