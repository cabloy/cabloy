module.exports = ebErrors => {
  class ErrorClass {
    constructor(ctx) {
      this.ctx = ctx;
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

      this.ctx.response.status = 200;
      this.ctx.response.type = 'application/json';
      this.ctx.response.body = body;
    }
    // code/message,args
    throw(module, code, ...args) {
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
    // code/message,args
    parseSuccess(module, code, ...args) {
      return this.parseCode(module, 0, code, ...args);
    }
    // parseCode
    parseCode(module, codeDefault, code, ...args) {
      const ebError = ebErrors[module];
      let message = null;

      if (typeof code === 'string') {
        message = this.ctx.text(code, ...args);
        code = codeDefault;
      } else if (code) {
        message = this.ctx.text(ebError[code], ...args);
      }

      if (!message) {
        message = this.ctx.text(ebError[codeDefault]);
      }

      return { code, message };
    }
  }
  return ErrorClass;
};
