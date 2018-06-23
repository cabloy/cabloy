const base = require('./middleware/base.js');
const auth = require('./middleware/auth.js');
const right = require('./middleware/right.js');

module.exports = {
  base,
  auth,
  right,
};
