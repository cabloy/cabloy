const eventLoginInfo = require('./bean/eventLoginInfo.js');
const eventWxworkMessage = require('./bean/eventWxworkMessage.js');

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.wxworkMessage': {
      mode: 'ctx',
      bean: eventWxworkMessage,
    },
  };
  return beans;
};
