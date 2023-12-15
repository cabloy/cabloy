module.exports = [
  // settings:instance
  {
    method: 'post',
    path: 'settings/instance/list',
    controller: 'settings',
    action: 'instanceList',
    meta: { right: { type: 'resource', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'settings/instance/load',
    controller: 'settings',
    action: 'instanceLoad',
    meta: { right: { type: 'resource', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'settings/instance/save',
    controller: 'settings',
    action: 'instanceSave',
    meta: { right: { type: 'resource', name: 'settings' } },
  },
  // settings:user
  { method: 'post', path: 'settings/user/list', controller: 'settings', action: 'userList' },
  { method: 'post', path: 'settings/user/load', controller: 'settings', action: 'userLoad' },
  { method: 'post', path: 'settings/user/save', controller: 'settings', action: 'userSave' },
];
