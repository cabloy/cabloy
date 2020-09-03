const auth = require('./controller/auth.js');

module.exports = [
  // auth
  { method: 'post', path: 'auth/list', controller: 'auth' },
];
