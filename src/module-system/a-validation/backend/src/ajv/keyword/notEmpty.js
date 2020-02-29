module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data) {
      if (schema && checkIfEmpty(data)) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('RequiredField') }];
        return false;
      }
      return true;
    };
    return fun;
  },
};

function checkIfEmpty(value) {
  // except 0
  return value === '' || value === undefined || value === null;
}
