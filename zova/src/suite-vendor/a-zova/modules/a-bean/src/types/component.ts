import { types } from 'typestyle';
import { TypeRenderComponentJsxPropsPublic } from 'zova-jsx';

export interface IVonaComponentRecord {}

export type TypeComponentOptions<K extends keyof IVonaComponentRecord> = {
  name: K;
  options?: IVonaComponentRecord[K];
} & TypeComponentOptionsProps;

export interface TypeComponentOptionsProps extends TypeRenderComponentJsxPropsPublic {
  class?: any;
  style?: types.NestedCSSProperties;
}
