module.exports = {
  errors: true,
  compile(schema, schemaProperty) {
    const fun = function(data) {
      if (schema && checkIfEmpty(schemaProperty, data)) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('RequiredField') }];
        return false;
      }
      return true;
    };
    return fun;
  },
};

function checkIfEmpty(schemaProperty, value) {
  const type = schemaProperty.type;
  // number
  if (type === 'number') return !value;
  // except 0
  return value === '' || value === undefined || value === null;
}
