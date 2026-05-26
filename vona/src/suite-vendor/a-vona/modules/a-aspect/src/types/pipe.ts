import type { OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsBaseSimple,
  TypeOnionOptionsEnableSimple,
} from 'vona-module-a-onion';
import type {
  RouteHandlerArgumentMeta,
  RouteHandlerArgumentType,
  TypeExtractValue,
} from 'vona-module-a-openapi';
import type { IApiPathRecord } from 'vona-module-a-web';
import type z from 'zod';

export interface IPipeRecordGlobal {}
export interface IPipeRecordLocal {}
export type IPipeRecord = IPipeRecordGlobal & IPipeRecordLocal;

export interface IPipeTransform<T = unknown, R = T> {
  transform(
    value: T,
    metadata: RouteHandlerArgumentMeta,
    options: IDecoratorPipeOptions,
  ): Promise<R>;
}

export interface IDecoratorPipeOptionsArgument {
  type?: RouteHandlerArgumentType;
  field?: string;
  schema?: z.ZodType;
  extractValue?: TypeExtractValue;
}

export interface IDecoratorPipeOptions extends TypeOnionOptionsEnableSimple {
  argIndex?: number;
}

export interface IDecoratorPipeOptionsGlobal
  extends
    TypeOnionOptionsBaseSimple<keyof IApiPathRecord>,
    IOnionOptionsDeps<keyof IPipeRecordGlobal> {
  argIndex?: number;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    pipe: ServiceOnion<IPipeRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    pipe: OmitNever<IPipeRecord>;
  }

  export interface IBeanSceneRecord {
    pipe: never;
  }
}
