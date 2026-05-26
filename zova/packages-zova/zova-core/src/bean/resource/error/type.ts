import type { ComponentPublicInstance } from 'vue';

import type { IErrorObject } from './errorObject.ts';

export const SymbolErrorInstanceInfo = Symbol('SymbolErrorInstanceInfo');

export interface IErrorInstanceInfo {
  instance?: ComponentPublicInstance | null;
  info?: string;
}

export interface IErrorHandlerEventData {
  err: Error;
  instance?: ComponentPublicInstance | null;
  info?: string;
}

export type IErrorHandlerEventResult = Error | undefined;

export interface IModuleError {
  throw(...args: any[]): never;
  parseFail(...args: any[]): IErrorObject;
}

export type TypeModuleErrors<T> = {
  [prop in keyof T]: IModuleError;
};

declare module 'zova-core' {
  export interface IEventRecord {
    'app:errorHandler': { data: IErrorHandlerEventData; result: IErrorHandlerEventResult };
  }
}
