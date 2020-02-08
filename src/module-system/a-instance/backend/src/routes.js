const version = require('./controller/version.js');
const instance = require('./controller/instance.js');

module.exports = [
  // version
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner', meta: { instance: { enable: false } } },
  // instance
  { method: 'post', path: 'instance/item', controller: instance, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
  { method: 'post', path: 'instance/save', controller: instance, middlewares: 'validate',
    meta: {
      validate: { validator: 'instance' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    },
  },
  { method: 'post', path: 'instance/getConfigsPreview', controller: instance, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
  { method: 'post', path: 'instance/startup', controller: instance, middlewares: 'inner', meta: { instance: { enable: true }, auth: { enable: false } } },
  { method: 'post', path: 'instance/broadcast/resetCache', controller: instance, middlewares: 'inner', meta: { auth: { enable: false } } },
];
