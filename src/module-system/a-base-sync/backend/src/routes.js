const version = require('./controller/version.js');
const base = require('./controller/base.js');
const user = require('./controller/user.js');
const atom = require('./controller/atom.js');
const atomClass = require('./controller/atomClass.js');
const atomAction = require('./controller/atomAction.js');
const func = require('./controller/function.js');
const auth = require('./controller/auth.js');
const comment = require('./controller/comment.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    // base
    { method: 'post', path: 'base/modules', controller: base },
    { method: 'post', path: 'base/locales', controller: base },
    { method: 'post', path: 'base/atomClasses', controller: base },
    { method: 'post', path: 'base/actions', controller: base },
    { method: 'post', path: 'base/flags', controller: base },
    { method: 'post', path: 'base/menus', controller: base },
    { method: 'post', path: 'base/functions', controller: base },
    // atom
    { method: 'post', path: 'atom/create', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 1 } },
    },
    { method: 'post', path: 'atom/read', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/select', controller: atom },
    { method: 'post', path: 'atom/write', controller: atom, middlewares: 'validate,transaction',
      meta: {
        right: { type: 'atom', action: 3 },
        validate: { data: 'item' },
      },
    },
    { method: 'post', path: 'atom/submit', controller: atom, middlewares: 'validate,transaction',
      meta: {
        right: { type: 'atom', action: 3 },
        validate: { data: 'item' },
      },
    },
    { method: 'post', path: 'atom/delete', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 4 } },
    },
    { method: 'post', path: 'atom/action', controller: atom, middlewares: 'validate,transaction',
      meta: {
        right: { type: 'atom' },
        validate: { data: 'item' },
      },
    },
    { method: 'post', path: 'atom/enable', controller: atom },
    { method: 'post', path: 'atom/star', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/labels', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/actions', controller: atom },
    { method: 'post', path: 'atom/schema', controller: atom },
    { method: 'post', path: 'atom/validator', controller: atom },
    // comment
    { method: 'post', path: 'comment/save', controller: comment, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/list', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/delete', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/item', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    // user
    { method: 'post', path: 'user/getLabels', controller: user },
    { method: 'post', path: 'user/setLabels', controller: user },
    // function
    { method: 'post', path: 'function/list', controller: func },
    { method: 'post', path: 'function/star', controller: func },
    { method: 'post', path: 'function/check', controller: func },
    { method: 'post', path: 'function/checkLocale', controller: func, middlewares: 'inner' },
    { method: 'post', path: 'function/register', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'function/clearLocales', controller: func, middlewares: 'inner',
      meta: { instance: { enable: false } },
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
    // auth
    { method: 'post', path: 'auth/echo', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/check', controller: auth, meta: { auth: { user: true } } },
    { method: 'post', path: 'auth/logout', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/installAuthProviders', controller: auth, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
  ];
  return routes;
};
