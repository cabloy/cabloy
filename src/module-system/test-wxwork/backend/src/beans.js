const eventLoginInfo = require('./bean/eventLoginInfo.js');

module.exports = app => {
  const beans = {
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
  };
  return beans;
};
