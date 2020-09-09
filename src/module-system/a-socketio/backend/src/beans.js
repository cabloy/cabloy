const localMessage = require('./bean/local.message.js');
const localMessageClass = require('./bean/local.messageClass.js');
const localProcedure = require('./bean/local.procedure.js');
const broadcastSocketEmit = require('./bean/broadcast.socketEmit.js');
const queueRegisterMessageClass = require('./bean/queue.registerMessageClass.js');
const queueSaveMessage = require('./bean/queue.saveMessage.js');
const queueProcess = require('./bean/queue.process.js');
const queueDelivery = require('./bean/queue.delivery.js');
const queuePush = require('./bean/queue.push.js');
const queuePushDirect = require('./bean/queue.pushDirect.js');
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
      mode: 'app',
      bean: broadcastSocketEmit,
    },
    // queue
    'queue.registerMessageClass': {
      mode: 'app',
      bean: queueRegisterMessageClass,
    },
    'queue.saveMessage': {
      mode: 'app',
      bean: queueSaveMessage,
    },
    'queue.process': {
      mode: 'app',
      bean: queueProcess,
    },
    'queue.delivery': {
      mode: 'app',
      bean: queueDelivery,
    },
    'queue.push': {
      mode: 'app',
      bean: queuePush,
    },
    'queue.pushDirect': {
      mode: 'app',
      bean: queuePushDirect,
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
