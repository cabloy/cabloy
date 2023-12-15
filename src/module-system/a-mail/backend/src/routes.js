module.exports = [
  // scene
  {
    method: 'post',
    path: 'scene/list',
    controller: 'scene',
    meta: { right: { type: 'resource', name: 'mailManagement' } },
  },
  {
    method: 'post',
    path: 'scene/save',
    controller: 'scene',
    middlewares: 'validate',
    meta: {
      right: { type: 'resource', name: 'mailManagement' }, //
      validate: { validator: 'mailScene' },
    },
  },
  {
    method: 'post',
    path: 'scene/delete',
    controller: 'scene',
    meta: { right: { type: 'resource', name: 'mailManagement' } },
  },
  {
    method: 'post',
    path: 'scene/add',
    controller: 'scene',
    meta: { right: { type: 'resource', name: 'mailManagement' } },
  },
];
