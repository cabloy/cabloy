const version = require('./controller/version.js');
const party = require('./controller/party.js');
const partyPublic = require('./controller/partyPublic.js');
const testAtomStarLabel = require('./controller/test/atom/starLabel.js');
const testAtomAll = require('./controller/test/atom/all.js');
const testAtomPublicFlow = require('./controller/test/atom/publicFlow.js');
const testAtomRight = require('./controller/test/atom/right.js');
const testFunctionRight = require('./controller/test/function/right.js');
const testFunctionAll = require('./controller/test/function/all.js');
const testFunctionPublic = require('./controller/test/function/public.js');
const testCtxPerformAction = require('./controller/test/ctx/performAction.js');
const testCtxTransaction = require('./controller/test/ctx/transaction.js');
const testCtxTail = require('./controller/test/ctx/tail.js');
const testCtxSession = require('./controller/test/ctx/session.js');
const testCtxRequest = require('./controller/test/ctx/request.js');
const testCtxResponse = require('./controller/test/ctx/response.js');
const testCtxConfig = require('./controller/test/ctx/config.js');
const testCtxLocale = require('./controller/test/ctx/locale.js');
const testCacheMem = require('./controller/test/cache/mem.js');
const testCacheDb = require('./controller/test/cache/db.js');
const testCacheRedis = require('./controller/test/cache/redis.js');
const testRoleUserRole = require('./controller/test/role/userRole.js');
const testEventHello = require('./controller/test/event/hello.js');
const testEventUserVerify = require('./controller/test/event/userVerify.js');
const testFeatHttpLog = require('./controller/test/feat/httpLog.js');
const testFeatStartup = require('./controller/test/feat/startup.js');
const testFeatSendMail = require('./controller/test/feat/sendMail.js');
const testFeatHook = require('./controller/test/feat/hook.js');
const testFeatInstance = require('./controller/test/feat/instance.js');
const testFeatProgress = require('./controller/test/feat/progress.js');
const testFeatSequence = require('./controller/test/feat/sequence.js');
const testFeatSettings = require('./controller/test/feat/settings.js');
const testFeatStatus = require('./controller/test/feat/status.js');
const testFeatValidation = require('./controller/test/feat/validation.js');
const testFeatMiddleware = require('./controller/test/feat/middleware.js');
const testFeatQueue = require('./controller/test/feat/queue.js');
const testFeatBroadcast = require('./controller/test/feat/broadcast.js');
const testMonkeyee = require('./controller/test/monkey/monkeyee.js');
const testKitchensinkAutocomplete = require('./controller/kitchen-sink/autocomplete.js');
const testKitchensinkGuide = require('./controller/kitchen-sink/guide.js');
const testKitchensinkFormSchemaValidation = require('./controller/kitchen-sink/form-schema-validation.js');
const testKitchensinkPtrIsLoadMore = require('./controller/kitchen-sink/ptr-is-loadmore.js');

module.exports = app => {
  let routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      // atom: party
      { method: 'post', path: 'party/create', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/read', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/select', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/write', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/delete', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/action', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/enable', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'party/types', controller: party },

      // atom: partyPublic (only for test)
      { method: 'post', path: 'partyPublic/create', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/read', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/select', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/write', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/delete', controller: partyPublic, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/action', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'partyPublic/enable', controller: party, middlewares: 'inner', meta: { auth: { enable: false } } },

      // test/atom/starLabel
      { method: 'post', path: 'test/atom/starLabel', controller: testAtomStarLabel, middlewares: 'test' },
      // test/atom/all
      { method: 'post', path: 'test/atom/all', controller: testAtomAll, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/atom/publicFlow
      { method: 'post', path: 'test/atom/publicFlow', controller: testAtomPublicFlow, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/atom/right(checked by middleware)
      { method: 'post', path: 'test/atom/checkRightCreate', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 1 } },
      },
      { method: 'post', path: 'test/atom/checkRightRead', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 2 } },
      },
      { method: 'post', path: 'test/atom/checkRightWrite', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 3 } },
      },
      { method: 'post', path: 'test/atom/checkRightAction', controller: testAtomRight, middlewares: 'test',
        meta: { right: { type: 'atom', action: 101 } },
      },

      // test/function/right
      { method: 'post', path: 'test/function/checkRightFunctionUser', controller: testFunctionRight, middlewares: 'test',
        meta: { right: { type: 'function', module: 'a-baseadmin', name: 'user' } },
      },
      // test/function/all
      { method: 'post', path: 'test/function/all', controller: testFunctionAll, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/function/public
      { method: 'post', path: 'test/function/functionPublic', controller: testFunctionPublic, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/role/userRole
      { method: 'post', path: 'test/role/userRole', controller: testRoleUserRole, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/ctx/performAction
      { method: 'post', path: 'test/ctx/performAction', controller: testCtxPerformAction, middlewares: 'test' },
      { method: 'post', path: 'test/ctx/performAction/echo', controller: testCtxPerformAction, middlewares: 'test' },
      // test/ctx/transaction
      { method: 'post', path: 'test/ctx/transaction', controller: testCtxTransaction, middlewares: 'test,transaction' },
      // test/ctx/tail
      { method: 'post', path: 'test/ctx/tail', controller: testCtxTail, middlewares: 'test' },
      // test/ctx/session
      { method: 'post', path: 'test/ctx/session', controller: testCtxSession, middlewares: 'test' },
      { method: 'post', path: 'test/ctx/session/echo1', controller: testCtxSession, middlewares: 'test' },
      { method: 'post', path: 'test/ctx/session/echo2', controller: testCtxSession, middlewares: 'test' },
      // test/ctx/request
      { method: 'post', path: 'test/ctx/request/:id', controller: testCtxRequest, action: 'request', middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/requestXML', controller: testCtxRequest, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/ctx/response
      { method: 'post', path: 'test/ctx/response/success', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/response/successMore', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/response/fail', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/response/throwError', controller: testCtxResponse, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/ctx/config
      { method: 'post', path: 'test/ctx/config/test', controller: testCtxConfig, middlewares: 'test', meta: { auth: { enable: false } } },
      // test/ctx/locale
      { method: 'post', path: 'test/ctx/locale/enus', controller: testCtxLocale, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/ctx/locale/zhcn', controller: testCtxLocale, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/event/hello
      { method: 'post', path: 'test/event/hello', controller: testEventHello, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/event/helloEcho', controller: testEventHello, middlewares: 'test,inner', meta: { auth: { enable: false } } },
      // test/event/userVerify
      { method: 'post', path: 'test/event/userVerify', controller: testEventUserVerify, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/event/loginInfo', controller: testEventUserVerify, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/event/loginInfoDashboard', controller: testEventUserVerify, meta: { auth: { enable: false } } },
      // test/cache
      { method: 'post', path: 'test/cache/mem', controller: testCacheMem, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/cache/db', controller: testCacheDb, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/cache/redis', controller: testCacheRedis, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/httpLog
      { method: 'post', path: 'test/feat/httpLog', controller: testFeatHttpLog, middlewares: 'test,httpLog', meta: { auth: { enable: false } } },

      // test/feat/startup
      { method: 'post', path: 'test/feat/startup/all', controller: testFeatStartup, middlewares: 'inner', meta: { instance: { enable: false } } },
      { method: 'post', path: 'test/feat/startup/instance', controller: testFeatStartup, middlewares: 'inner', meta: { auth: { enable: false } } },

      // test/feat/sendMail
      { method: 'post', path: 'test/feat/sendMail', controller: testFeatSendMail, middlewares: 'test,mail', meta: { auth: { enable: false } } },

      // test/feat/hook
      { method: 'post', path: 'test/feat/hook/echo', controller: testFeatHook, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/hook/echoBefore', controller: testFeatHook, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/hook/echoAfter', controller: testFeatHook, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/hook
      { method: 'post', path: 'test/feat/instance', controller: testFeatInstance, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/progress
      { method: 'post', path: 'test/feat/progress', controller: testFeatProgress, middlewares: 'progress', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/progressInBackground', controller: testFeatProgress, middlewares: 'inner,progress', meta: { auth: { enable: false } } },

      // test/feat/sequence
      { method: 'post', path: 'test/feat/sequence', controller: testFeatSequence, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/settings
      { method: 'post', path: 'test/feat/settings', controller: testFeatSettings, middlewares: 'test' },

      // test/feat/status
      { method: 'post', path: 'test/feat/status', controller: testFeatStatus, middlewares: 'test', meta: { auth: { enable: false } } },

      // test/feat/validation
      { method: 'post', path: 'test/feat/validation/success', controller: testFeatValidation, middlewares: 'test,validate',
        meta: { auth: { enable: false }, validate: { validator: 'userTest' } },
      },
      { method: 'post', path: 'test/feat/validation/fail', controller: testFeatValidation, middlewares: 'test,validate',
        meta: { auth: { enable: false }, validate: { validator: 'userTest' } },
      },
      { method: 'post', path: 'test/feat/validation/schema', controller: testFeatValidation, middlewares: 'test,validate',
        meta: { auth: { enable: false }, validate: { validator: 'userTest', schema: 'settingsUserExtra' } },
      },

      // test/feat/middleware
      { method: 'post', path: 'test/feat/middleware/interception', controller: testFeatMiddleware, middlewares: 'test,testInterception' },
      { method: 'post', path: 'test/feat/middleware/restructuring', controller: testFeatMiddleware, middlewares: 'test,testInterception,testRestructuring' },
      { method: 'post', path: 'test/feat/middleware/injection', controller: testFeatMiddleware, middlewares: 'test,testInterception,testRestructuring,testInjection' },

      // test/feat/queue
      { method: 'post', path: 'test/feat/queue', controller: testFeatQueue, middlewares: 'inner' },
      { method: 'post', path: 'test/feat/pushAsync', controller: testFeatQueue, middlewares: 'test' },
      { method: 'post', path: 'test/feat/push', controller: testFeatQueue, middlewares: 'test' },

      // test/feat/broadcast
      { method: 'post', path: 'test/feat/broadcast', controller: testFeatBroadcast, middlewares: 'inner', meta: { auth: { enable: false } } },
      { method: 'post', path: 'test/feat/broadcast/emit', controller: testFeatBroadcast, middlewares: 'test' },

      // test/monkey/monkeyee
      { method: 'post', path: 'test/monkey/monkeyee/test', controller: testMonkeyee, middlewares: 'test' },

      // kitchen-sink/guide
      { method: 'post', path: 'kitchen-sink/guide/echo', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo3', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo4', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo6', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo7', controller: testKitchensinkGuide },
      { method: 'post', path: 'kitchen-sink/guide/echo8', controller: testKitchensinkGuide, middlewares: 'transaction' },
      { method: 'post', path: 'kitchen-sink/guide/echo9', controller: testKitchensinkGuide,
        meta: {
          right: { type: 'function', name: 'kitchenSink' },
        },
      },

      // kitchen-sink/autocomplete
      { method: 'get', path: 'kitchen-sink/autocomplete/languages/:query', controller: testKitchensinkAutocomplete, action: 'languages', meta: { auth: { enable: false } } },
      // kitchen-sink/form-schema-validation
      { method: 'get', path: 'kitchen-sink/form-schema-validation/load', controller: testKitchensinkFormSchemaValidation },
      { method: 'post', path: 'kitchen-sink/form-schema-validation/saveSimple', controller: testKitchensinkFormSchemaValidation },
      { method: 'post', path: 'kitchen-sink/form-schema-validation/saveValidation', controller: testKitchensinkFormSchemaValidation, middlewares: 'validate',
        meta: { validate: { validator: 'formTest' } },
      },
      { method: 'post', path: 'kitchen-sink/form-captcha/signup', controller: testKitchensinkFormSchemaValidation, middlewares: 'captchaVerify,validate',
        meta: {
          captchaVerify: { scene: { name: 'formCaptchaTest' } },
          validate: { validator: 'formCaptchaTest' },
        },
      },
      { method: 'post', path: 'kitchen-sink/form-mobile-verify/mobileVerify', controller: testKitchensinkFormSchemaValidation, middlewares: 'captchaVerify,validate',
        meta: {
          captchaVerify: { scene: { name: 'formMobileVerifyTest' } },
          validate: { validator: 'formMobileVerifyTest' },
        },
      },
      // kitchen-sink/ptr-is-loadmore
      { method: 'post', path: 'kitchen-sink/ptr-is-loadmore/list', controller: testKitchensinkPtrIsLoadMore },

    ]);
  }
  return routes;
};
