const util = require('./middleware/util.js');
const cors = require('./middleware/cors.js');
const base = require('./middleware/base.js');
const auth = require('./middleware/auth.js');
const right = require('./middleware/right.js');
const jsonp = require('./middleware/jsonp.js');
const httpLog = require('./middleware/httpLog.js');

module.exports = {
  util,
  cors,
  base,
  auth,
  right,
  jsonp,
  httpLog,
};
