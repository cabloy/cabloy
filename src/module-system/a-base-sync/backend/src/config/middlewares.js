const base = require('./middleware/base.js');
const auth = require('./middleware/auth.js');
const right = require('./middleware/right.js');
const jsonp = require('./middleware/jsonp.js');
const httpLog = require('./middleware/httpLog.js');

module.exports = {
  base,
  auth,
  right,
  jsonp,
  httpLog,
};
