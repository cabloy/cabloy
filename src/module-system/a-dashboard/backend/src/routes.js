module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // profile
    { method: 'post', path: 'profile/list', controller: 'profile' },
    { method: 'post', path: 'profile/create', controller: 'profile', meta: { auth: { user: true } } },
    { method: 'post', path: 'profile/item', controller: 'profile', meta: { auth: { user: true } } },
    { method: 'post', path: 'profile/delete', controller: 'profile', meta: { auth: { user: true } } },
    { method: 'post', path: 'profile/save', controller: 'profile', meta: { auth: { user: true } } },
  ];
  return routes;
};
