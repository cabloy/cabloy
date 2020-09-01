const appBean = require('./bean/app.js');
const classBean = require('./bean/class.js');
const ctxBean = require('./bean/ctx.js');

module.exports = app => {
  const beans = {};
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(beans, {
      appBeanTest: {
        mode: 'app',
        bean: appBean,
      },
      classBeanTest: {
        mode: 'app',
        bean: classBean,
      },
      ctxBeanTest: {
        mode: 'ctx',
        bean: ctxBean,
        global: true,
      },
    });
  }

  return beans;
};
