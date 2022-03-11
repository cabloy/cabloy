const versionManager = require('./bean/version.manager.js');
const atomResource = require('./bean/atom.resource.js');
const localProcedure = require('./bean/local.procedure.js');
const broadcastAuthProviderChanged = require('./bean/broadcast.authProviderChanged.js');
const queueSchedule = require('./bean/queue.schedule.js');
const queueRoleBuild = require('./bean/queue.roleBuild.js');
const startupRegisterPassport = require('./bean/startup.registerPassport.js');
const startupInstallAuthProviders = require('./bean/startup.installAuthProviders.js');
const startupLoadSchedules = require('./bean/startup.loadSchedules.js');
const startupLoadAtomStatics = require('./bean/startup.loadAtomStatics.js');
const startupCheckResourceLocales = require('./bean/startup.checkResourceLocales.js');
const middlewareInner = require('./bean/middleware.inner.js');
const middlewareTest = require('./bean/middleware.test.js');
const middlewareTransaction = require('./bean/middleware.transaction.js');
const middlewareCors = require('./bean/middleware.cors.js');
const middlewareAuth = require('./bean/middleware.auth.js');
const middlewareRight = require('./bean/middleware.right.js');
const middlewareJsonp = require('./bean/middleware.jsonp.js');
const middlewareHttpLog = require('./bean/middleware.httpLog.js');
const middlewareconnectionAuth = require('./bean/middleware.connectionAuth.js');
const beanLocal = require('./bean/bean.local.js');
const beanAtomBase = require('./bean/bean.atomBase.js');
const beanAtom = require('./bean/bean.atom.js');
const beanAtomAction = require('./bean/bean.atomAction.js');
const beanAtomClass = require('./bean/bean.atomClass.js');
const beanAuth = require('./bean/bean.auth.js');
const beanAuthProvider = require('./bean/bean.authProvider.js');
const beanBase = require('./bean/bean.base.js');
const beanResource = require('./bean/bean.resource.js');
const beanRole = require('./bean/bean.role.js');
const beanUser = require('./bean/bean.user.js');
const beanUtil = require('./bean/bean.util.js');
const beanCategory = require('./bean/bean.category.js');
const beanTag = require('./bean/bean.tag.js');
const statsDrafts = require('./bean/stats.drafts.js');
const statsDraftsFlowing = require('./bean/stats.draftsFlowing.js');
const statsStars = require('./bean/stats.stars.js');
const statsLabels = require('./bean/stats.labels.js');
const statsStarsLabels = require('./bean/stats.starsLabels.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.resource': {
      mode: 'app',
      bean: atomResource,
    },
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
    'queue.schedule': {
      mode: 'app',
      bean: queueSchedule,
    },
    'queue.roleBuild': {
      mode: 'app',
      bean: queueRoleBuild,
    },
    // startup
    'startup.registerPassport': {
      mode: 'app',
      bean: startupRegisterPassport,
    },
    'startup.installAuthProviders': {
      mode: 'app',
      bean: startupInstallAuthProviders,
    },
    'startup.loadSchedules': {
      mode: 'app',
      bean: startupLoadSchedules,
    },
    'startup.loadAtomStatics': {
      mode: 'app',
      bean: startupLoadAtomStatics,
    },
    'startup.checkResourceLocales': {
      mode: 'app',
      bean: startupCheckResourceLocales,
    },
    // middleware
    'middleware.inner': {
      mode: 'ctx',
      bean: middlewareInner,
    },
    'middleware.test': {
      mode: 'ctx',
      bean: middlewareTest,
    },
    'middleware.transaction': {
      mode: 'ctx',
      bean: middlewareTransaction,
    },
    'middleware.cors': {
      mode: 'ctx',
      bean: middlewareCors,
    },
    'middleware.auth': {
      mode: 'ctx',
      bean: middlewareAuth,
    },
    'middleware.right': {
      mode: 'ctx',
      bean: middlewareRight,
    },
    'middleware.jsonp': {
      mode: 'ctx',
      bean: middlewareJsonp,
    },
    'middleware.httpLog': {
      mode: 'ctx',
      bean: middlewareHttpLog,
    },
    'middleware.connectionAuth': {
      mode: 'ctx',
      bean: middlewareconnectionAuth,
    },
    // global
    local: {
      mode: 'ctx',
      bean: beanLocal,
      global: true,
    },
    atomBase: {
      mode: 'app',
      bean: beanAtomBase,
      global: true,
    },
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
    authProvider: {
      mode: 'ctx',
      bean: beanAuthProvider,
      global: true,
    },
    base: {
      mode: 'ctx',
      bean: beanBase,
      global: true,
    },
    resource: {
      mode: 'ctx',
      bean: beanResource,
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
      mode: 'app',
      bean: beanUtil,
      global: true,
    },
    category: {
      mode: 'ctx',
      bean: beanCategory,
      global: true,
    },
    tag: {
      mode: 'ctx',
      bean: beanTag,
      global: true,
    },
    // stats
    'stats.drafts': {
      mode: 'ctx',
      bean: statsDrafts,
    },
    'stats.draftsFlowing': {
      mode: 'ctx',
      bean: statsDraftsFlowing,
    },
    'stats.stars': {
      mode: 'ctx',
      bean: statsStars,
    },
    'stats.labels': {
      mode: 'ctx',
      bean: statsLabels,
    },
    'stats.starsLabels': {
      mode: 'ctx',
      bean: statsStarsLabels,
    },
  };
  return beans;
};
