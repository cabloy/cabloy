const eventAccountMigration = require('./bean/event.accountMigration.js');
const smsProviderTest = require('./bean/sms.provider.test.js');
const smsProviderAliyun = require('./bean/sms.provider.aliyun.js');
const captchaProvider = require('./bean/captcha.provider.captcha.js');
const authProviderSms = require('./bean/auth.provider.sms.js');
const broadcastSmsProviderChanged = require('./bean/broadcast.smsProviderChanged.js');
const startupCacheSmsProviders = require('./bean/startup.cacheSmsProviders.js');
const beanSmsProviderCache = require('./bean/bean.smsProviderCache.js');

module.exports = {
  // event
  'event.accountMigration': {
    mode: 'ctx',
    bean: eventAccountMigration,
  },
  // sms.provider
  'sms.provider.test': {
    mode: 'ctx',
    bean: smsProviderTest,
  },
  'sms.provider.aliyun': {
    mode: 'ctx',
    bean: smsProviderAliyun,
  },
  // captcha.provider
  'captcha.provider.captcha': {
    mode: 'ctx',
    bean: captchaProvider,
  },
  // auth.provider
  'auth.provider.sms': {
    mode: 'ctx',
    bean: authProviderSms,
  },
  // broadcast
  'broadcast.smsProviderChanged': {
    mode: 'app',
    bean: broadcastSmsProviderChanged,
  },
  // startup
  'startup.cacheSmsProviders': {
    mode: 'app',
    bean: startupCacheSmsProviders,
  },
  // global
  smsProviderCache: {
    mode: 'ctx',
    bean: beanSmsProviderCache,
    global: true,
  },
};
