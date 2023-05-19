const versionManager = require('./bean/version.manager.js');
const atomResource = require('./bean/atom.resource.js');
const atomRole = require('./bean/atom.role.js');
const atomRoleRight = require('./bean/atom.roleRight.js');
const atomRoleRightSpread = require('./bean/atom.roleRightSpread.js');
const atomUser = require('./bean/atom.user.js');
const localProcedure = require('./bean/local.procedure.js');
const queueSchedule = require('./bean/queue.schedule.js');
const queueRoleBuild = require('./bean/queue.roleBuild.js');
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
const beanAtomStatic = require('./bean/bean.atomStatic.js');
const beanAuth = require('./bean/bean.auth.js');
const beanBase = require('./bean/bean.base.js');
const beanResource = require('./bean/bean.resource.js');
const beanRole = require('./bean/bean.role.js');
const beanUser = require('./bean/bean.user.js');
const beanUtil = require('./bean/bean.util.js');
const beanCategory = require('./bean/bean.category.js');
const beanTag = require('./bean/bean.tag.js');
const beanBodyCrypto = require('./bean/bean.bodyCrypto.js');
const statsDraftsCommon = require('./bean/stats.draftsCommon.js');
const statsStars = require('./bean/stats.stars.js');
const statsLabels = require('./bean/stats.labels.js');
const statsStarsLabels = require('./bean/stats.starsLabels.js');
const summerCacheAtomClassInfo = require('./bean/summer.cache.atomClassInfo.js');
const summerCacheAtomClassInner = require('./bean/summer.cache.atomClassInner.js');
const summerCacheRoleScopesOfUser = require('./bean/summer.cache.roleScopesOfUser.js');
const summerCacheUserInfo = require('./bean/summer.cache.userInfo.js');
const summerCacheCategoryInfo = require('./bean/summer.cache.categoryInfo.js');

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
    'atom.role': {
      mode: 'app',
      bean: atomRole,
    },
    'atom.roleRight': {
      mode: 'app',
      bean: atomRoleRight,
    },
    'atom.roleRightSpread': {
      mode: 'app',
      bean: atomRoleRightSpread,
    },
    'atom.user': {
      mode: 'app',
      bean: atomUser,
    },
    // local
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
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
    atomStatic: {
      mode: 'ctx',
      bean: beanAtomStatic,
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
    bodyCrypto: {
      mode: 'ctx',
      bean: beanBodyCrypto,
      global: true,
    },
    // stats
    'stats.draftsCommon': {
      mode: 'ctx',
      bean: statsDraftsCommon,
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
    // summer
    'summer.cache.atomClassInfo': {
      mode: 'ctx',
      bean: summerCacheAtomClassInfo,
    },
    'summer.cache.atomClassInner': {
      mode: 'ctx',
      bean: summerCacheAtomClassInner,
    },
    'summer.cache.roleScopesOfUser': {
      mode: 'ctx',
      bean: summerCacheRoleScopesOfUser,
    },
    'summer.cache.userInfo': {
      mode: 'ctx',
      bean: summerCacheUserInfo,
    },
    'summer.cache.categoryInfo': {
      mode: 'ctx',
      bean: summerCacheCategoryInfo,
    },
  };
  return beans;
};
