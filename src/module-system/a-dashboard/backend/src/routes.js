module.exports = app => {
  const routes = [
    // dashboard
    { method: 'post', path: 'dashboard/itemByKey', controller: 'dashboard' },
    { method: 'post', path: 'dashboard/item', controller: 'dashboard',
      meta: { right: { type: 'atom', action: 2, checkFlow: true } },
    },
    { method: 'post', path: 'dashboard/loadItemUser', controller: 'dashboard', meta: { auth: { user: true } } },
    { method: 'post', path: 'dashboard/saveItemUser', controller: 'dashboard', meta: { auth: { user: true } } },
    { method: 'post', path: 'dashboard/createItemUser', controller: 'dashboard',
      meta: { right: { type: 'atom', action: 2, checkFlow: true } },
    },

    // { method: 'post', path: 'profile/item', controller: 'profile', meta: { auth: { user: true } } },
    // { method: 'post', path: 'profile/delete', controller: 'profile', meta: { auth: { user: true } } },
    // { method: 'post', path: 'profile/save', controller: 'profile', meta: { auth: { user: true } } },
  ];
  return routes;
};
