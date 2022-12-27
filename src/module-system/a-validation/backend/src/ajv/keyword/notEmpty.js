module.exports = {
  errors: true,
  compile(schema, schemaProperty) {
    const fun = function (data, path, rootData) {
      // notEmpty=false
      if (!schema) return true;
      // ctx
      const ctx = this;
      // saveDraftOnly
      const saveDraftOnly = ctx.bean.util.getProperty(ctx.meta, 'validateHost.options.saveDraftOnly');
      if (saveDraftOnly) {
        // not check
        return true;
      }
      // expression
      const expression = schema && schema.expression;
      if (expression) {
        const res = evaluateExpression({ expression, rootData, ctx });
        if (!res) return true;
      }
      if (checkIfEmpty(schema, schemaProperty, data)) {
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

function checkIfEmpty(schema, schemaProperty, value) {
  const type = schemaProperty.type;
  // ignoreZero
  let ignoreZero = schema.ignoreZero;
  if (ignoreZero === undefined) {
    ignoreZero = type !== 'number' && type !== 'integer';
  }
  if (schema.ignoreZero && value === 0) return false;
  return !value;
}
