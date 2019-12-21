const wechatUser = require('./model/wechatUser.js');
const auth = require('./model/auth.js');

module.exports = app => {
  const models = {
    wechatUser,
    auth,
  };
  return models;
};
