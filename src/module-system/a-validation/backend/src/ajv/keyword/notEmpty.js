module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data) {
      const res = schema ? !!data : !data;
      if (!res) {
        fun.errors = [{ keyword: 'notEmpty', params: [], message: this.text('Required') }];
      }
      return res;
    };
    return fun;
  },
};
