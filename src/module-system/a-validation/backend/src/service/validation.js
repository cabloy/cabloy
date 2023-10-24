module.exports = app => {
  class Validation extends app.Service {
    schema({ module, validator, schema }) {
      return this.ctx.bean.validation.getSchema({ module, validator, schema });
    }
    async validate({ params, data }) {
      const { module, validator, schema } = params;
      await this.ctx.bean.validation._validate({
        atomClas: null,
        data,
        options: {
          schema: { module, validator, schema },
        },
        filterOptions: {
          type: true,
          ebReadOnly: true,
        },
      });
      return { data };
    }
  }

  return Validation;
};
