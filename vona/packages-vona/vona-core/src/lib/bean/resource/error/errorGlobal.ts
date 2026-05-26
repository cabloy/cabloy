import type { TypeScopesErrorCodes } from '../../type.ts';

declare global {
  export interface Error {
    code?: TypeScopesErrorCodes | number | undefined;
    status?: number | undefined;
  }
}
export {};
