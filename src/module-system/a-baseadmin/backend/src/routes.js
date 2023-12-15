module.exports = [
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
  // role/roleUsers
  {
    method: 'post',
    path: 'role/roleUsers',
    controller: 'role',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'roleUsers' } },
  },
  // role/addUserRole
  {
    method: 'post',
    path: 'role/addUserRole',
    controller: 'role',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'roleUsers' } },
  },
  // role/deleteUserRole
  {
    method: 'post',
    path: 'role/deleteUserRole',
    controller: 'role',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'roleUsers' } },
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
  // resourceRight
  {
    method: 'post',
    path: 'resourceRight/rights',
    controller: 'resourceRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
  },
  {
    method: 'post',
    path: 'resourceRight/add',
    controller: 'resourceRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
  },
  {
    method: 'post',
    path: 'resourceRight/delete',
    controller: 'resourceRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
  },
  {
    method: 'post',
    path: 'resourceRight/spreads',
    controller: 'resourceRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
  },
  // atomRight
  {
    method: 'post',
    path: 'atomRight/rights',
    controller: 'atomRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
  },
  {
    method: 'post',
    path: 'atomRight/add',
    controller: 'atomRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
  },
  {
    method: 'post',
    path: 'atomRight/delete',
    controller: 'atomRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
  },
  {
    method: 'post',
    path: 'atomRight/spreads',
    controller: 'atomRight',
    meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
  },
  // user/select
  {
    method: 'post',
    path: 'user/select',
    controller: 'user',
  },
  // user/userRoles
  {
    method: 'post',
    path: 'user/userRoles',
    controller: 'user',
    meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'userRoles' } },
  },
  // user/addUserRole
  {
    method: 'post',
    path: 'user/addUserRole',
    controller: 'user',
    meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'userRoles' } },
  },
  // role/deleteUserRole
  {
    method: 'post',
    path: 'user/deleteUserRole',
    controller: 'user',
    meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'userRoles' } },
  },
  {
    method: 'post',
    path: 'user/atomRights',
    controller: 'user',
    meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'atomAuthorizations' } },
  },
  {
    method: 'post',
    path: 'user/resourceRights',
    controller: 'user',
    meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'resourceAuthorizations' } },
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
