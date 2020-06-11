const wechatUser = require('./model/wechatUser.js');

module.exports = app => {
  const models = {
    wechatUser,
  };
  return models;
};
