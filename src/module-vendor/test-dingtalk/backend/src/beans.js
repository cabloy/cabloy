const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventDingtalkCallback = require('./bean/event.dingtalkCallback.js');

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.dingtalkCallback': {
      mode: 'ctx',
      bean: eventDingtalkCallback,
    },
  };
  return beans;
};
