import type { OmitNever } from 'zova';
import type { ServiceOnion } from 'zova-module-a-bean';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { TableIdentity } from 'table-identity';

export const SymbolCommandResult = Symbol('SymbolCommandResult');

export type TypeCommandOptions<K extends keyof ICommandRecord> = {
  name: K;
  options?: Omit<ICommandRecord[K], typeof SymbolCommandResult>;
  res?: string;
};

export type NextCommandExecute = (res?: any) => any | Promise<any>;

export interface ICommandRecord {}

export interface ICommandExecute {
  execute(
    options: IDecoratorCommandOptions,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ): any | Promise<any>;
}

export interface IDecoratorCommandOptions<Result = any> {
  [SymbolCommandResult]: Result;
  // res?: string; // need not define here
}

export interface ICommandOptionsBase<Result = any> extends IDecoratorCommandOptions<Result> {}

export interface ICommandBulkOptionsBase<Result = any> extends ICommandOptionsBase<Result> {
  resource?: string;
}

export interface ICommandRowOptionsBase<Result = any> extends ICommandOptionsBase<Result> {
  resource?: string;
  id?: TableIdentity;
}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    command: ServiceOnion<IDecoratorCommandOptions, keyof ICommandRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    command: OmitNever<ICommandRecord>;
  }

  export interface IBeanSceneRecord {
    command: never;
  }
}
