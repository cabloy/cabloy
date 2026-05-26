import type { IErrorObject } from './errorObject.ts';
import type { IModuleError } from './type.ts';

import { BeanSimple } from '../../beanSimple.ts';

const BeanModuleScope = Symbol('BeanScopeError#ModuleScope');
const BeanErrorCode = Symbol('BeanScopeError#BeanErrorCode');

export class BeanScopeErrorImpl extends BeanSimple implements IModuleError {
  private [BeanModuleScope]: string;
  private [BeanErrorCode]: number | string;

  constructor(moduleScope, errorCode) {
    super();
    this[BeanModuleScope] = moduleScope;
    this[BeanErrorCode] = errorCode;
  }

  throw(...args: any[]): never {
    return this.app.meta.error.throw(this[BeanModuleScope], this[BeanErrorCode], ...args);
  }

  parseFail(...args: any[]): IErrorObject {
    return this.app.meta.error.parseFail(this[BeanModuleScope], this[BeanErrorCode], ...args);
  }
}
