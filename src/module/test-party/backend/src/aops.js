const regExp = require('./aop/regExp.js');
const simple = require('./aop/simple.js');

module.exports = app => {
  const aops = {};
  if (app.meta.isTest || app.meta.isLocal) {
    Object.assign(aops, {
      simple: {
        match: 'test.ctx',
        mode: 'ctx',
        bean: simple,
      },
      regExp: {
        match: [ /^test-party.test\.\w+$/, 'test.ctx' ],
        mode: 'ctx',
        bean: regExp,
      },
    });
  }

  return aops;
};
