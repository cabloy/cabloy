import type { TypeErrorsInternal } from './errorInternal.ts';
import type { IErrorObject } from './errorObject.ts';

type TypeErrorMethodNames = 'parseFail' | 'parseSuccess';

interface TypeErrorMethodCommon {
  (code: number | string, ...args: any[]): IErrorObject;
}

interface TypeErrorMethodFail {
  (code: number | string, ...args: any[]): void;
}

interface TypeErrorMethodThrow {
  (code: keyof TypeErrorsInternal | number, ...args: any[]): never;
}

interface TypeErrorMethodSuccess {
  (data?: any, ...args: any[]): void;
}

interface TypeErrorMethodParseCode {
  (codeDefault: number, code: number | string, ...args: any[]): IErrorObject;
}

type TypeErrorMethods = { success: TypeErrorMethodSuccess } & { throw: TypeErrorMethodThrow } & {
  fail: TypeErrorMethodFail;
} & {
  [property in TypeErrorMethodNames]: TypeErrorMethodCommon;
} & { parseCode: TypeErrorMethodParseCode };

export interface ApplicationError extends TypeErrorMethods {}
