const versionManager = require('./bean/version.manager.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const authProviderSimple = require('./bean/auth.provider.simple.js');
const localSimple = require('./bean/local.simple.js');
const beanAuthSimple = require('./bean/bean.authSimple.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // event
  'event.accountMigration': {
    bean: eventAccountMigration,
  },
  // auth.provider
  'auth.provider.simple': {
    bean: authProviderSimple,
  },
  // local
  'local.simple': {
    bean: localSimple,
  },
  // global
  authSimple: {
    bean: beanAuthSimple,
    global: true,
  },
};
