const eventLoginInfo = require('./bean/eventLoginInfo.js');
const eventDingtalkCallback = require('./bean/eventDingtalkCallback.js');

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
