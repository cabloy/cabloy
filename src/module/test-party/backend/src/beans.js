const testApp = require('./bean/testApp.js');
const testClass = require('./bean/testClass.js');
const testCtx = require('./bean/testCtx.js');
const eventLoginInfoDashboard = require('./bean/eventLoginInfoDashboard.js');

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
    });
  }

  return beans;
};
