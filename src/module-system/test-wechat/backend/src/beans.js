const eventLoginInfo = require('./bean/eventLoginInfo.js');
const eventWechatMessage = require('./bean/eventWechatMessage.js');
const eventWechatMessageMini = require('./bean/eventWechatMessageMini.js');

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.wechatMessage': {
      mode: 'ctx',
      bean: eventWechatMessage,
    },
    'event.wechatMessageMini': {
      mode: 'ctx',
      bean: eventWechatMessageMini,
    },
  };
  return beans;
};
