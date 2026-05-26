import { BeanSimple } from '../../beanSimple.ts';
import { errorsInternal } from './errorInternal.ts';

export class ErrorClass extends BeanSimple {
  /** @internal */
  public async initialize() {}

  // code/message,args
  throw(module, code, ...args): never {
    const body = this.parseFail(module, code, ...args);
    const err = new Error();
    err.code = body.code;
    err.message = body.message;
    if (body.code < 500) err.status = body.code;
    throw err;
  }

  // code/message,args
  parseFail(module, code, ...args) {
    if (typeof code === 'object') return code;
    return this.parseCode(module, 1, code, ...args);
  }

  // parseCode
  parseCode(module, codeDefault, code, ...args) {
    const ebError = this.sys.meta.error.errors[module];

    // '403'->403
    if (typeof code === 'string' && /^\d+$/.test(code)) {
      code = Number(code);
    }

    // convert from enum
    let text;
    if (code && typeof code === 'string') {
      text = code;
      code = ebError[code];
    }

    if (code === undefined || code === null || code === '') {
      code = codeDefault;
    }

    let message: string;
    if (code <= 1000) {
      message = this.app.meta.locale.getText(
        true,
        undefined,
        undefined,
        errorsInternal[code],
        ...args,
      );
    } else {
      message = this.app.meta.locale.getText(false, module, undefined, text || code, ...args);
    }

    code = __combineErrorCode(module, code);
    return { code, message };
  }
}

function __combineErrorCode(module, code) {
  if (typeof code !== 'number' || code <= 1000) return code;
  return module ? `${module}:${code}` : code;
}
