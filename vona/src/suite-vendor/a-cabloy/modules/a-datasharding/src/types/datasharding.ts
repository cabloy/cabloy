import type { VonaContext } from 'vona';
import type { IDatabaseClientRecord } from 'vona-module-a-orm';

export type TypeDatasourceType = 'auto' | 'read' | 'write';

export interface IDatashardingSwitchOptions {
  datasourceType?: TypeDatasourceType;
  cacheDatasourceWrite?: boolean;
}

export type TypeDatashardingReadsFn = (ctx: VonaContext) => (keyof IDatabaseClientRecord)[];
export type TypeDatashardingReads = TypeDatashardingReadsFn | (keyof IDatabaseClientRecord)[];
export type TypeDatashardingWritesFn = (ctx: VonaContext) => (keyof IDatabaseClientRecord)[];
export type TypeDatashardingWrites = TypeDatashardingWritesFn | (keyof IDatabaseClientRecord)[];

export type TypeDatashardingRandomReadFn = (
  ctx: VonaContext,
  reads: (keyof IDatabaseClientRecord)[],
) => keyof IDatabaseClientRecord | undefined;
export type TypeDatashardingRandomWriteFn = (
  ctx: VonaContext,
  writes: (keyof IDatabaseClientRecord)[],
) => keyof IDatabaseClientRecord | undefined;

export interface IConfigDatashardingClient {
  reads: TypeDatashardingReads;
  writes: TypeDatashardingWrites;
  randomRead?: TypeDatashardingRandomReadFn;
  randomWrite?: TypeDatashardingRandomWriteFn;
}
