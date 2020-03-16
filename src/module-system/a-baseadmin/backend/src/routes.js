const version = require('./controller/version.js');
const role = require('./controller/role.js');
const user = require('./controller/user.js');
const atomRight = require('./controller/atomRight.js');
const functionRight = require('./controller/functionRight.js');
const auth = require('./controller/auth.js');
const _function = require('./controller/function.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    // role
    { method: 'post', path: 'role/children', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/item', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/save', controller: role, middlewares: 'validate',
      meta: { validate: { validator: 'role' }, right: { type: 'function', name: 'role' } },
    },
    { method: 'post', path: 'role/add', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/move', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/delete', controller: role, middlewares: 'transaction', meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/includes', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/addRoleInc', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/removeRoleInc', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/dirty', controller: role, meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/build', controller: role, middlewares: 'progress', meta: { right: { type: 'function', name: 'role' } } },
    { method: 'post', path: 'role/buildInBackground', controller: role, middlewares: 'inner,progress', meta: { auth: { enable: false } } },
    // user
    { method: 'post', path: 'user/list', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/item', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/disable', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/delete', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/roles', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/addRole', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/removeRole', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/atomRights', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    { method: 'post', path: 'user/functionRights', controller: user, meta: { right: { type: 'function', name: 'user' } } },
    // atomRight
    { method: 'post', path: 'atomRight/rights', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    { method: 'post', path: 'atomRight/add', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    { method: 'post', path: 'atomRight/delete', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    { method: 'post', path: 'atomRight/spreads', controller: atomRight, meta: { right: { type: 'function', name: 'atomRight' } } },
    // functionRight
    { method: 'post', path: 'functionRight/rights', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    { method: 'post', path: 'functionRight/add', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    { method: 'post', path: 'functionRight/delete', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    { method: 'post', path: 'functionRight/spreads', controller: functionRight, meta: { right: { type: 'function', name: 'functionRight' } } },
    // auth
    { method: 'post', path: 'auth/list', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    { method: 'post', path: 'auth/disable', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    { method: 'post', path: 'auth/item', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    { method: 'post', path: 'auth/save', controller: auth, meta: { right: { type: 'function', name: 'auth' } } },
    // function
    { method: 'post', path: 'function/scenesLoad', controller: _function, meta: { right: { type: 'function', name: 'menuScene' } } },
    { method: 'post', path: 'function/scenesSaveSortings', controller: _function, meta: { right: { type: 'function', name: 'menuScene' } } },
  ];
  return routes;
};
