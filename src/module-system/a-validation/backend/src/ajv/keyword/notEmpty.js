const vm = require('vm');

module.exports = {
  errors: true,
  compile(schema, schemaProperty) {
    const fun = function(data, path, rootData) {
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
  const scope = {
    ... rootData,
    _meta: {
      host: ctx.meta && ctx.meta.validateHost,
      user: ctx.state.user && ctx.state.user.op,
    },
  };
  return vm.runInContext(expression, vm.createContext(scope));
}

function checkIfEmpty(schemaProperty, value) {
  const type = schemaProperty.type;
  // number
  if (type === 'number' || type === 'integer') return !value;
  // except 0
  return value === '' || value === undefined || value === null;
}
