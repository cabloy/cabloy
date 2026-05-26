import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';
import type { RefinementCtx } from 'zod';

export type TypeRefinementCtx = RefinementCtx;

export interface IZodRefineRecord {}

export interface IZodRefineExecute<T = unknown> {
  execute(
    value: T,
    refinementCtx: TypeRefinementCtx,
    options: IDecoratorZodRefineOptions,
  ): Promise<void>;
}

export interface IDecoratorZodRefineOptions {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    zodRefine: ServiceOnion<IZodRefineRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    zodRefine: OmitNever<IZodRefineRecord>;
  }

  export interface IBeanSceneRecord {
    zodRefine: never;
  }
}
