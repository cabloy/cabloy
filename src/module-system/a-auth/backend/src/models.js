const auth = require('./model/auth.js');
const authProvider = require('./model/authProvider.js');

module.exports = app => {
  const models = {
    auth,
    authProvider,
  };
  return models;
};
