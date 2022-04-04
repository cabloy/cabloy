module.exports = app => {
  const routes = [
    // role/childrenTop
    {
      method: 'post',
      path: 'role/childrenTop',
      controller: 'role',
    },
    // role/children
    {
      method: 'post',
      path: 'role/children',
      controller: 'role',
    },
    // role/delete
    {
      method: 'post',
      path: 'role/delete',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'delete' } },
    },
    // role/clone
    {
      method: 'post',
      path: 'role/clone',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'clone' } },
    },
    // role/move
    {
      method: 'post',
      path: 'role/move',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'move' } },
    },
    // role/addChild
    {
      method: 'post',
      path: 'role/addChild',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'addChild' } },
    },
    // role/includes
    {
      method: 'post',
      path: 'role/includes',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'includes' } },
    },
    // role/addRoleInc
    {
      method: 'post',
      path: 'role/addRoleInc',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'includes' } },
    },
    {
      method: 'post',
      path: 'role/removeRoleInc',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'includes' } },
    },

    //
    { method: 'post', path: 'role/item', controller: 'role' },
    {
      method: 'post',
      path: 'role/save',
      controller: 'role',
      middlewares: 'validate',
      meta: { validate: { validator: 'role' }, right: { type: 'resource', name: 'role' } },
    },

    // user
    {
      method: 'post',
      path: 'user/select',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user,selectUsers' } },
    },
    { method: 'post', path: 'user/list', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/item', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/disable', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/delete', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/roles', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    { method: 'post', path: 'user/addRole', controller: 'user', meta: { right: { type: 'resource', name: 'user' } } },
    {
      method: 'post',
      path: 'user/removeRole',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user' } },
    },
    {
      method: 'post',
      path: 'user/atomRights',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user' } },
    },
    {
      method: 'post',
      path: 'user/resourceRights',
      controller: 'user',
      meta: { right: { type: 'resource', name: 'user' } },
    },
    // atomRight
    {
      method: 'post',
      path: 'atomRight/rights',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    {
      method: 'post',
      path: 'atomRight/add',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    {
      method: 'post',
      path: 'atomRight/delete',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    {
      method: 'post',
      path: 'atomRight/spreads',
      controller: 'atomRight',
      meta: { right: { type: 'resource', name: 'atomRight' } },
    },
    // resourceRight
    {
      method: 'post',
      path: 'resourceRight/rights',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    {
      method: 'post',
      path: 'resourceRight/add',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    {
      method: 'post',
      path: 'resourceRight/delete',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    {
      method: 'post',
      path: 'resourceRight/spreads',
      controller: 'resourceRight',
      meta: { right: { type: 'resource', name: 'resourceRight' } },
    },
    // functionRight
    {
      method: 'post',
      path: 'functionRight/rights',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    {
      method: 'post',
      path: 'functionRight/add',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    {
      method: 'post',
      path: 'functionRight/delete',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    {
      method: 'post',
      path: 'functionRight/spreads',
      controller: 'functionRight',
      meta: { right: { type: 'resource', name: 'functionRight' } },
    },
    // auth
    { method: 'post', path: 'auth/list', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/disable', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/save', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    // auth scene
    {
      method: 'post',
      path: 'authScene/disable',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
    {
      method: 'post',
      path: 'authScene/save',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
    {
      method: 'post',
      path: 'authScene/add',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
    {
      method: 'post',
      path: 'authScene/delete',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
  ];
  return routes;
};
