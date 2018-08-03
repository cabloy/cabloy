module.exports = app => {

  class Validation extends app.Service {

    schema({ module, validator, schema }) {
      return this.ctx.meta.validation.getSchema({ module, validator, schema });
    }

  }

  return Validation;
};
