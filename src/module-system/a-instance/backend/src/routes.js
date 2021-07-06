module.exports = [
  // instance
  { method: 'post', path: 'instance/item', controller: 'instance', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
  {
    method: 'post',
    path: 'instance/save',
    controller: 'instance',
    middlewares: 'validate',
    meta: {
      validate: { validator: 'instance' },
      right: { type: 'resource', module: 'a-settings', name: 'settings' },
    },
  },
  { method: 'post', path: 'instance/getConfigsPreview', controller: 'instance', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
  { method: 'post', path: 'instance/reload', controller: 'instance', meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } } },
];
