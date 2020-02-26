const require3 = require('require3');
const moment = require3('moment');

module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data, path, rootData, name) {
      if (!schema) return true;
      if (Array.isArray(data)) {
        const res = [];
        for (const item of data) {
          const _date = transformDate(fun, this, item);
          if (!_date) return false;
          res.push(_date);
        }
        rootData[name] = res;
        return true;
      }
      const _date = transformDate(fun, this, data);
      if (!_date) return false;
      rootData[name] = _date;
      return true;
    };
    return fun;
  },
};

function transformDate(fun, ctx, data) {
  const _date = moment(data);
  if (!_date.isValid()) {
    fun.errors = [{ keyword: 'x-date', params: [], message: ctx.text('Invalid Date') }];
    return null;
  }
  return _date.toDate();
}
