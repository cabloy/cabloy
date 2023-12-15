const versionManager = require('./bean/version.manager.js');
const eventAccountMigration = require('./bean/event.accountMigration.js');
const atomAuthOpen = require('./bean/atom.authOpen.js');
const authProviderOpen = require('./bean/auth.provider.open.js');
const localToken = require('./bean/local.token.js');
const beanAuthOpen = require('./bean/bean.authOpen.js');

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
  // atom
  'atom.authOpen': {
    bean: atomAuthOpen,
  },
  // auth.provider
  'auth.provider.open': {
    mode: 'ctx',
    bean: authProviderOpen,
  },
  // local
  'local.token': {
    mode: 'ctx',
    bean: localToken,
  },
  // global
  authOpen: {
    mode: 'ctx',
    bean: beanAuthOpen,
    global: true,
  },
};
