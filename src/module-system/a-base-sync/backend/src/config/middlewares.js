const inner = require('./middleware/inner.js');
const test = require('./middleware/test.js');
const transaction = require('./middleware/transaction.js');
const cors = require('./middleware/cors.js');
const auth = require('./middleware/auth.js');
const right = require('./middleware/right.js');
const jsonp = require('./middleware/jsonp.js');
const httpLog = require('./middleware/httpLog.js');

module.exports = {
  inner,
  test,
  transaction,
  cors,
  auth,
  right,
  jsonp,
  httpLog,
};
