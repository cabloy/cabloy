module.exports = app => {
  const routes = [
    // message: selfBuilt/contacts
    {
      method: 'get',
      path: 'message/:providerScene',
      controller: 'message',
      action: 'index',
      meta: { auth: { enable: false } },
    },
    {
      method: 'post',
      path: 'message/:providerScene',
      controller: 'message',
      action: 'index',
      meta: { auth: { enable: false } },
    },
    // contacts
    {
      method: 'post',
      path: 'contacts/sync',
      controller: 'contacts',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'contacts/syncStatus',
      controller: 'contacts',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },

    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },
    { method: 'post', path: 'jssdk/jsconfigAgent', controller: 'jssdk' },

    // authMini
    { method: 'post', path: 'authMini/login', controller: 'authMini' },
  ];
  return routes;
};
