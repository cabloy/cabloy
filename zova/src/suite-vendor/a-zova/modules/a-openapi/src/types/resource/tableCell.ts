import type { types } from 'typestyle';
import type { TypeRenderComponentJsx } from 'zova-jsx';

export interface IResourceTableCellRecord {}

export interface IResourceTableCellOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
}

export interface IResourceRenderTableCellOptionsCell {
  render?: keyof IResourceTableCellRecord | TypeRenderComponentJsx;
  options?: IResourceTableCellOptionsBase;
}
