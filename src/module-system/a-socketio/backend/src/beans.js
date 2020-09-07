const localMessage = require('./bean/local.message.js');
const localMessageClass = require('./bean/local.messageClass.js');
const localProcedure = require('./bean/local.procedure.js');
const broadcastSocketEmit = require('./bean/broadcast.socketEmit.js');
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
    // broadcast
    'broadcast.socketEmit': {
      mode: 'ctx',
      bean: broadcastSocketEmit,
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
