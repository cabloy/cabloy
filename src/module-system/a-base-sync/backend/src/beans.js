const localProcedure = require('./bean/local.procedure.js');
const broadcastAuthProviderChanged = require('./bean/broadcast.authProviderChanged.js');
const beanAtom = require('./bean/bean.atom.js');
const beanAtomAction = require('./bean/bean.atomAction.js');
const beanAtomClass = require('./bean/bean.atomClass.js');
const beanAuth = require('./bean/bean.auth.js');
const beanBase = require('./bean/bean.base.js');
const beanFunction = require('./bean/bean.function.js');
const beanRole = require('./bean/bean.role.js');
const beanUser = require('./bean/bean.user.js');
const beanUtil = require('./bean/bean.util.js');

module.exports = app => {
  const beans = {
    // local
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // broadcast
    'broadcast.authProviderChanged': {
      mode: 'ctx',
      bean: broadcastAuthProviderChanged,
    },
    // global
    atom: {
      mode: 'ctx',
      bean: beanAtom,
      global: true,
    },
    atomAction: {
      mode: 'ctx',
      bean: beanAtomAction,
      global: true,
    },
    atomClass: {
      mode: 'ctx',
      bean: beanAtomClass,
      global: true,
    },
    auth: {
      mode: 'ctx',
      bean: beanAuth,
      global: true,
    },
    base: {
      mode: 'ctx',
      bean: beanBase,
      global: true,
    },
    function: {
      mode: 'ctx',
      bean: beanFunction,
      global: true,
    },
    role: {
      mode: 'ctx',
      bean: beanRole,
      global: true,
    },
    user: {
      mode: 'ctx',
      bean: beanUser,
      global: true,
    },
    util: {
      mode: 'ctx',
      bean: beanUtil,
      global: true,
    },
  };
  return beans;
};
