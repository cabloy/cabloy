import { BeanSimple } from '../../beanSimple.ts';

export class ErrorClass extends BeanSimple {
  ebErrors: any;

  constructor(ebErrors) {
    super();
    this.ebErrors = ebErrors;
  }

  // data,code/message,args
  success(module, data, code, ...args) {
    const body = this.parseSuccess(module, code, ...args);

    this.ctx.response.status = 200;
    this.ctx.response.type = 'application/json';
    this.ctx.response.body = { code: 0, message: body.message, data };
  }

  // code/message,args
  fail(module, code, ...args) {
    const body = this.parseFail(module, code, ...args);

    this.ctx.response.status = __calcStatus(body.code);
    this.ctx.response.type = 'application/json';
    this.ctx.response.body = { code: body.code, message: body.message }; // body maybe Error
  }

  // code/message,args
  throw(module, code, ...args): never {
    const body = this.parseFail(module, code, ...args);
    const err = new Error();
    err.code = body.code;
    err.message = body.message;
    err.status = __calcStatus(body.code);
    throw err;
  }

  // code/message,args
  parseFail(module, code, ...args) {
    if (typeof code === 'object') return code;
    return this.parseCode(module, 500, code, ...args);
  }

  // code/message,args
  parseSuccess(module, code, ...args) {
    return this.parseCode(module, 0, code, ...args);
  }

  // parseCode
  parseCode(module, codeDefault, code, ...args) {
    const ebError = this.ebErrors[module];

    // '403'->403
    if (typeof code === 'string' && /^\d+$/.test(code)) {
      code = Number(code);
    }

    // convert from enum
    let text;
    if (ebError && code && typeof code === 'string') {
      text = code;
      code = ebError[code];
    }

    if (code === undefined || code === null || code === '') {
      code = codeDefault;
    }

    let message: string;
    if (typeof code === 'number' && code <= 1000) {
      message = this.app.meta.locale.getText(true, undefined, undefined, String(code), ...args);
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

function __calcStatus(code) {
  return typeof code !== 'string' && code < 1000 ? code : 500;
}
