module.exports = {
  errors: true,
  compile(schema, schemaProperty) {
    const fun = function (data, path, rootData) {
      // notEmpty=false
      if (!schema) return true;
      // expression
      const expression = schema && schema.expression;
      if (expression) {
        const res = evaluateExpression({ expression, rootData, ctx: this });
        if (!res) return true;
      }
      if (checkIfEmpty(schemaProperty, data)) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('RequiredField') }];
        return false;
      }
      return true;
    };
    return fun;
  },
};

function evaluateExpression({ expression, rootData, ctx }) {
  try {
    const globals = {
      ...rootData,
      _meta: {
        host: ctx.meta && ctx.meta.validateHost,
        user: ctx.state.user && ctx.state.user.op,
      },
    };
    return ctx.bean.util.evaluateExpression({ expression, globals });
  } catch (err) {
    console.log(expression, rootData);
    throw err;
  }
}

function checkIfEmpty(schemaProperty, value) {
  const type = schemaProperty.type;
  // number
  if (type === 'number' || type === 'integer') return !value;
  // except 0
  return value === '' || value === undefined || value === null;
}
