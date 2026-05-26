import type { PowerPartial } from '../../index.ts';

export const constantDefault = {
  modules: {},
};

export type ZovaConstant = {
  modules: Record<string, object>;
} & typeof constantDefault;

export type ZovaConstantOptional = PowerPartial<ZovaConstant>;
