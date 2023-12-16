const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const moduleInfo = module.info;

module.exports = class Captcha {
  async verify(_context) {
    const { providerInstanceId, context, data, dataInput } = _context;
    // sms provider
    const { provider, config } = this.__createSMSProvider();
    // verify
    await provider.verify({ providerInstanceId, context, data, dataInput, config });
  }

  __createSMSProvider(options) {
    const providers = this.ctx.bean.smsProviderCache.getSmsProvidersConfigCache();
    // provider name
    let providerName = options && options.providerName;
    if (!providerName) {
      // current
      providerName = Object.keys(providers).find(providerName => providers[providerName].current);
      // test
      if (!providerName && (this.ctx.app.meta.isTest || this.ctx.app.meta.isLocal)) {
        providerName = 'test';
      }
      if (!providerName) {
        // prompt
        const message = chalk.keyword('orange')(this.ctx.text('smsProviderNonePrompt'));
        console.log('\n' + boxen(message, boxenOptions));
        this.ctx.throw.module(moduleInfo.relativeName, 1001);
      }
    }
    // provider
    const provider = this.ctx.bean._getBean(moduleInfo.relativeName, `sms.provider.${providerName}`);
    const config = providers[providerName];
    return { provider, config };
  }
};
