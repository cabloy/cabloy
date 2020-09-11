module.exports = app => {
  const routes = [
    // message
    { method: 'post', path: 'callback/index', controller: 'callback', meta: { auth: { enable: false } } },
    // contacts
    { method: 'post', path: 'contacts/sync', controller: 'contacts', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'contacts/syncStatus', controller: 'contacts', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },

    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },

    // auth
    { method: 'post', path: 'auth/login', controller: 'auth', meta: { auth: { enable: false } } },
    { method: 'post', path: 'authMini/login', controller: 'auth', action: 'loginMini', meta: { auth: { enable: false } } },

  ];
  return routes;
};
