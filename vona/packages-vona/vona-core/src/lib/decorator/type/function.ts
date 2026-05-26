export type FunctionAsync<RESULT> = () => Promise<RESULT>;
export type Next<DATA = any, RESULT = any> = (data?: DATA) => Promise<RESULT>;
export type NextSync<DATA = any, RESULT = any> = (data?: DATA) => RESULT;
export type NextGeneral<DATA = any, RESULT = any> = (data?: DATA) => Promise<RESULT> | RESULT;
export const functionNoop = () => {};
export type FunctionAny = (...args: any[]) => any;
