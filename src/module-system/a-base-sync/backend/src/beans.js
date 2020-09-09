const localProcedure = require('./bean/local.procedure.js');
const broadcastAuthProviderChanged = require('./bean/broadcast.authProviderChanged.js');
const queueRegisterFunction = require('./bean/queue.registerFunction.js');
const queueRegisterAtomAction = require('./bean/queue.registerAtomAction.js');
const queueRegisterAtomClass = require('./bean/queue.registerAtomClass.js');
const queueRegisterAuthProvider = require('./bean/queue.registerAuthProvider.js');
const queueSchedule = require('./bean/queue.schedule.js');
const queueStartup = require('./bean/queue.startup.js');
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
      mode: 'app',
      bean: broadcastAuthProviderChanged,
    },
    // queue
    'queue.registerFunction': {
      mode: 'app',
      bean: queueRegisterFunction,
    },
    'queue.registerAtomAction': {
      mode: 'app',
      bean: queueRegisterAtomAction,
    },
    'queue.registerAtomClass': {
      mode: 'app',
      bean: queueRegisterAtomClass,
    },
    'queue.registerAuthProvider': {
      mode: 'app',
      bean: queueRegisterAuthProvider,
    },
    'queue.schedule': {
      mode: 'app',
      bean: queueSchedule,
    },
    'queue.startup': {
      mode: 'app',
      bean: queueStartup,
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
