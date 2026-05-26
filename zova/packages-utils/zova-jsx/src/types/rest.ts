import type { ComponentPublicInstance } from 'vue';
import type { Constructable, IComponentIntrinsicAttributes } from 'zova-core';

export interface TypeRenderComponentJsxPropsPublic extends IComponentIntrinsicAttributes {
  'key'?: string;
  'v-if'?: string | boolean;
  'v-for'?: string | any[];
  'v-each'?: string;
  'v-slot'?: string;
  'v-slot-scope'?: string;
  'children'?: any;
}

export interface TypeRenderComponentJsxProps extends TypeRenderComponentJsxPropsPublic {
  children: TypeRenderComponentJsx | TypeRenderComponentJsx[];
}

export interface TypeRenderComponentJsx {
  type: string;
  key?: string | null;
  props?: TypeRenderComponentJsxProps;
}

export type TypeRenderComponentNormal = Constructable<ComponentPublicInstance> | string;

export type TypeRenderComponent =
  | TypeRenderComponentNormal
  | TypeRenderComponentJsx
  | number
  | symbol;
