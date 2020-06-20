const version = require('./controller/version.js');
const io = require('./controller/io.js');
const messageClass = require('./controller/messageClass.js');
const message = require('./controller/message.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // io
    { method: 'post', path: 'subscribe', controller: io, meta: { auth: { user: true } } },
    { method: 'post', path: 'unsubscribe', controller: io, meta: { auth: { user: true } } },
    { method: 'post', path: 'io/queueSaveMessage', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'io/queueProcess', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'io/queueDelivery', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'io/queuePush', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'io/queuePushDirect', controller: io, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // messageClass
    { method: 'post', path: 'messageClass/queueRegister', controller: messageClass, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'messageClass/messageClass', controller: messageClass, meta: { auth: { user: true } } },
    // message
    { method: 'post', path: 'message/offset', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/select', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/count', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/setRead', controller: message, meta: { auth: { user: true } } },
    { method: 'post', path: 'message/delete', controller: message, meta: { auth: { user: true } } },
  ];
  return routes;
};
