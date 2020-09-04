const cors = require('./middleware/cors.js');
const auth = require('./middleware/auth.js');
const right = require('./middleware/right.js');
const jsonp = require('./middleware/jsonp.js');
const httpLog = require('./middleware/httpLog.js');

module.exports = {
  cors,
  auth,
  right,
  jsonp,
  httpLog,
};
