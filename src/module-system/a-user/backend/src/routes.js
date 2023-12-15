module.exports = [
  // user
  {
    method: 'post',
    path: 'user/save',
    controller: 'user',
    middlewares: 'validate',
    meta: { validate: { module: 'a-base', validator: 'user' } },
  },
  { method: 'post', path: 'user/saveAvatar', controller: 'user' },
  { method: 'post', path: 'user/saveLocale', controller: 'user' },
  { method: 'post', path: 'user/agent', controller: 'user' },
  { method: 'post', path: 'user/agentsBy', controller: 'user' },
  { method: 'post', path: 'user/userByMobile', controller: 'user' },
  { method: 'post', path: 'user/addAgent', controller: 'user' },
  { method: 'post', path: 'user/removeAgent', controller: 'user' },
  { method: 'post', path: 'user/switchAgent', controller: 'user' },
  { method: 'post', path: 'user/switchOffAgent', controller: 'user' },
  { method: 'post', path: 'user/authentications', controller: 'user' },
  { method: 'post', path: 'user/authenticationDisable', controller: 'user' },
  { method: 'post', path: 'user/themeLoad', controller: 'user' },
  { method: 'post', path: 'user/themeSave', controller: 'user' },
  {
    method: 'post',
    path: 'user/changeUserName',
    controller: 'user',
    middlewares: 'validate',
    meta: { validate: { module: 'a-base', validator: 'userChangeUserName' } },
  },
  // public
  { method: 'post', path: 'public/profile', controller: 'public' },
];
