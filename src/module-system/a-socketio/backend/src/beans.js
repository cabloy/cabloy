const localMessage = require('./bean/local.message.js');
const localMessageClass = require('./bean/local.messageClass.js');
const localProcedure = require('./bean/local.procedure.js');
const beanIO = require('./bean/bean.io.js');

module.exports = app => {
  const beans = {
    // local
    'local.message': {
      mode: 'ctx',
      bean: localMessage,
    },
    'local.messageClass': {
      mode: 'ctx',
      bean: localMessageClass,
    },
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // global
    io: {
      mode: 'ctx',
      bean: beanIO,
      global: true,
    },
  };
  return beans;
};
