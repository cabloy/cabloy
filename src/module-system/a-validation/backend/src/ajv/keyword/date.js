const require3 = require('require3');
const moment = require3('moment');

module.exports = {
  errors: true,
  compile(schema) {
    const fun = function(data, path, rootData, name) {
      if (!schema) return true;
      const _date = moment(data);
      if (!_date.isValid()) {
        fun.errors = [{ keyword: 'x-date', params: [], message: this.text('Invalid Date') }];
        return false;
      }
      rootData[name] = _date.toDate();
      return true;
    };
    return fun;
  },
};
