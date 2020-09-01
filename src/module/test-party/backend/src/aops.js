const regExpAop = require('./aop/regExp.js');
const simpleAop = require('./aop/simple.js');

module.exports = app => {
  const aops = {};
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(aops, {
      simpleAopTest: {
        match: 'ctxBeanTest',
        mode: 'ctx',
        bean: simpleAop,
      },
      regExpAopTest: {
        match: [ /^test-party\.\w+BeanTest$/, 'ctxBeanTest' ],
        mode: 'ctx',
        bean: regExpAop,
      },
    });
  }

  return aops;
};
