const testApp = require('./bean/testApp.js');
const testClass = require('./bean/testClass.js');
const testCtx = require('./bean/testCtx.js');
const eventLoginInfoDashboard = require('./bean/event.loginInfoDashboard.js');
const eventHelloEcho = require('./bean/event.helloEcho.js');
const eventUserVerify = require('./bean/event.userVerify.js');
const eventLoginInfo = require('./bean/event.loginInfo.js');

module.exports = app => {
  const beans = {};
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(beans, {
      appBeanTest: {
        mode: 'app',
        bean: testApp,
      },
      classBeanTest: {
        mode: 'app',
        bean: testClass,
      },
      ctxBeanTest: {
        mode: 'ctx',
        bean: testCtx,
        global: true,
      },
      'event.loginInfoDashboard': {
        mode: 'ctx',
        bean: eventLoginInfoDashboard,
      },
      'event.helloEcho': {
        mode: 'ctx',
        bean: eventHelloEcho,
      },
      'event.userVerify': {
        mode: 'ctx',
        bean: eventUserVerify,
      },
      'event.loginInfo': {
        mode: 'ctx',
        bean: eventLoginInfo,
      },
    });
  }

  return beans;
};
