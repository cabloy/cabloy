'use strict';

module.exports = function* home() {
  const data = yield this.service.test.get(123);
  this.body = data.name;
};
