const versionManager = require('./bean/version.manager.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const atomAuthOpen = require('./bean/atom.authOpen.js');
const authProviderOpen = require('./bean/auth.provider.open.js');
const localToken = require('./bean/local.token.js');
const beanAuthOpen = require('./bean/bean.authOpen.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // event
  'event.accountMigration': {
    bean: eventAccountMigration,
  },
  // atom
  'atom.authOpen': {
    bean: atomAuthOpen,
  },
  // auth.provider
  'auth.provider.open': {
    bean: authProviderOpen,
  },
  // local
  'local.token': {
    bean: localToken,
  },
  // global
  authOpen: {
    bean: beanAuthOpen,
    global: true,
  },
};
