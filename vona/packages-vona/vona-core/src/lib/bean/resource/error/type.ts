import type { IErrorObject } from './errorObject.ts';

export interface IModuleError {
  throw: (...args: any[]) => never;
  parseFail: (...args: any[]) => IErrorObject;
}

export type TypeModuleErrors<T> = {
  [prop in keyof T]: IModuleError;
};
