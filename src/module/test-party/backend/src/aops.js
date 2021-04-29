const regExp = require('./aop/regExp.js');
const simple = require('./aop/simple.js');

module.exports = app => {
  const aops = {};
  Object.assign(aops, {
    simple: {
      match: 'testctx',
      mode: 'ctx',
      bean: simple,
    },
    regExp: {
      match: [ /^test-party.test\.\w+$/, 'testctx' ],
      mode: 'ctx',
      bean: regExp,
    },
  });
  return aops;
};
