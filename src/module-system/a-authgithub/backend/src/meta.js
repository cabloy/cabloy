const authFn = require('./passport/auth.js');
module.exports = app => {
  return {
    auth: authFn(app),
  };
};
