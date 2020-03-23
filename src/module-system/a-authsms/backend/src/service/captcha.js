const require3 = require('require3');
const chalk = require3('chalk');
const boxen = require3('boxen');
const SMSProviders = require('../sms/providers.js');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = app => {

  class Captcha extends app.Service {

    __createSMSProvider() {
      // providrName
      let providerName = this.ctx.config.sms.provider;
      if (!providerName && (app.meta.isTest || app.meta.isLocal)) {
        providerName = 'test';
      }
      if (!providerName) {
        // prompt
        const message = chalk.keyword('orange')(this.ctx.text('smsProviderNonePrompt'));
        console.log('\n' + boxen(message, boxenOptions));
        this.ctx.throw(1001);
      }
      // provider
      return new (SMSProviders[providerName](this.ctx))();
    }

    async sendCode({ providerInstanceId, context }) {
      // sms provider
      const smsProvider = this.__createSMSProvider();
      const data = await smsProvider.sendCode({ context });
      // update
      await this.ctx.meta.captcha.update({
        providerInstanceId, data,
      });
    }

    async verify({ /* providerInstanceId, context,*/ data, dataInput }) {
      if (!data) this.ctx.throw(1002);
      if (data.token !== dataInput.token) this.ctx.throw(1003);
    }


  }

  return Captcha;
};
