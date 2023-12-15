const versionManager = require('./bean/version.manager.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const authProviderSimple = require('./bean/auth.provider.simple.js');
const localSimple = require('./bean/local.simple.js');
const beanAuthSimple = require('./bean/bean.authSimple.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // event
  'event.accountMigration': {
    mode: 'ctx',
    bean: eventAccountMigration,
  },
  // auth.provider
  'auth.provider.simple': {
    mode: 'ctx',
    bean: authProviderSimple,
  },
  // local
  'local.simple': {
    mode: 'ctx',
    bean: localSimple,
  },
  // global
  authSimple: {
    mode: 'ctx',
    bean: beanAuthSimple,
    global: true,
  },
};
