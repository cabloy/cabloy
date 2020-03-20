const version = require('./controller/version.js');
const base = require('./controller/base.js');
const user = require('./controller/user.js');
const atom = require('./controller/atom.js');
const atomClass = require('./controller/atomClass.js');
const atomAction = require('./controller/atomAction.js');
const func = require('./controller/function.js');
const auth = require('./controller/auth.js');
const comment = require('./controller/comment.js');
const layoutConfig = require('./controller/layoutConfig.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/update8FunctionScenes', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/update8Atoms', controller: version, middlewares: 'inner' },
    // base
    { method: 'post', path: 'base/modules', controller: base },
    { method: 'post', path: 'base/locales', controller: base },
    { method: 'post', path: 'base/atomClasses', controller: base },
    { method: 'post', path: 'base/actions', controller: base },
    { method: 'post', path: 'base/flags', controller: base },
    { method: 'post', path: 'base/orders', controller: base },
    { method: 'post', path: 'base/menus', controller: base },
    { method: 'post', path: 'base/panels', controller: base },
    { method: 'post', path: 'base/widgets', controller: base },
    { method: 'post', path: 'base/sections', controller: base },
    { method: 'post', path: 'base/buttons', controller: base },
    { method: 'post', path: 'base/functions', controller: base },
    { method: 'get', path: 'base/performAction', controller: base, middlewares: 'jsonp', meta: { auth: { enable: false } } },
    { method: 'get', path: 'base/qrcode', controller: base, meta: { auth: { enable: false } } },
    { method: 'post', path: 'base/themes', controller: base },
    // atom
    { method: 'post', path: 'atom/preferredRoles', controller: atom },
    { method: 'post', path: 'atom/create', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 1 } },
    },
    { method: 'post', path: 'atom/read', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/select', controller: atom },
    { method: 'post', path: 'atom/count', controller: atom },
    { method: 'post', path: 'atom/write', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 3 } },
    },
    { method: 'post', path: 'atom/submit', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 3 } },
    },
    { method: 'post', path: 'atom/delete', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 4 } },
    },
    { method: 'post', path: 'atom/action', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom' } },
    },
    { method: 'post', path: 'atom/enable', controller: atom, middlewares: 'transaction' },
    { method: 'post', path: 'atom/star', controller: atom,
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'atom/readCount', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/stats', controller: atom },
    { method: 'post', path: 'atom/labels', controller: atom,
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'atom/actions', controller: atom },
    { method: 'post', path: 'atom/schema', controller: atom },
    { method: 'post', path: 'atom/validator', controller: atom },
    // comment
    { method: 'post', path: 'comment/all', controller: comment },
    { method: 'post', path: 'comment/list', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/item', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/save', controller: comment, middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'comment/delete', controller: comment, middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'comment/heart', controller: comment, middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    // user
    { method: 'post', path: 'user/getLabels', controller: user },
    { method: 'post', path: 'user/setLabels', controller: user },
    // function
    { method: 'post', path: 'function/scenes', controller: func },
    { method: 'post', path: 'function/list', controller: func },
    { method: 'post', path: 'function/star', controller: func },
    { method: 'post', path: 'function/check', controller: func },
    { method: 'post', path: 'function/register', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'function/setLocales', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // atomAction
    { method: 'post', path: 'atomAction/register', controller: atomAction, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // atomClass
    { method: 'post', path: 'atomClass/register', controller: atomClass, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'atomClass/validatorSearch', controller: atomClass },
    { method: 'post', path: 'atomClass/checkRightCreate', controller: atomClass },
    { method: 'post', path: 'atomClass/atomClass', controller: atomClass },
    // auth
    { method: 'post', path: 'auth/echo', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/check', controller: auth, meta: { auth: { user: true } } },
    { method: 'post', path: 'auth/logout', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/installAuthProviders', controller: auth, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
    { method: 'post', path: 'auth/register', controller: auth, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'auth/providerChanged', controller: auth, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // cors
    { method: 'options', path: /.*/ },
    // layoutConfig
    { method: 'post', path: 'layoutConfig/load', controller: layoutConfig },
    { method: 'post', path: 'layoutConfig/save', controller: layoutConfig },
    { method: 'post', path: 'layoutConfig/saveKey', controller: layoutConfig },
  ];
  return routes;
};
