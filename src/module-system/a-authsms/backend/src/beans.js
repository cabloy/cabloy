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
    bean: eventAccountMigration,
  },
  // sms.provider
  'sms.provider.test': {
    bean: smsProviderTest,
  },
  'sms.provider.aliyun': {
    bean: smsProviderAliyun,
  },
  // captcha.provider
  'captcha.provider.captcha': {
    bean: captchaProvider,
  },
  // auth.provider
  'auth.provider.sms': {
    bean: authProviderSms,
  },
  // broadcast
  'broadcast.smsProviderChanged': {
    bean: broadcastSmsProviderChanged,
  },
  // startup
  'startup.cacheSmsProviders': {
    bean: startupCacheSmsProviders,
  },
  // global
  smsProviderCache: {
    bean: beanSmsProviderCache,
    global: true,
  },
};
