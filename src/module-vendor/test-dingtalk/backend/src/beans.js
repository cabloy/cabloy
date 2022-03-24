const eventLoginInfo = require('./bean/event.loginInfo.js');
const eventDingtalkMessageGeneral = require('./bean/event.dingtalkMessageGeneral.js');

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.dingtalkCallback': {
      mode: 'ctx',
      bean: eventDingtalkMessageGeneral,
    },
  };
  return beans;
};
