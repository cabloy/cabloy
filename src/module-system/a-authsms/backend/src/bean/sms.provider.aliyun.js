const popCore = require('@alicloud/pop-core');

const moduleInfo = module.info;
module.exports = class Provider {
  async sendCode({ providerInstanceId, context, config }) {
    // get
    const providerInstance = await this.ctx.bean.captcha.getProviderInstance({ providerInstanceId });
    if (!providerInstance) this.ctx.throw(403);
    // token
    const token = this.__prefix0(parseInt(Math.random() * 10000), 4);
    const templateParam = { code: token };
    // params
    const params = {
      PhoneNumbers: context.mobile,
      SignName: config.signName,
      TemplateCode: config.templates[providerInstance.sceneName],
      TemplateParam: JSON.stringify(templateParam),
    };
    // send
    await this.__sendSms({ params, config });
    // ok
    return { token };
  }

  async verify({ data, dataInput }) {
    if (!data) this.ctx.throw.module(moduleInfo.relativeName, 1002);
    if (data.token !== dataInput.token) this.ctx.throw.module(moduleInfo.relativeName, 1003);
  }

  async __sendSms({ params, config }) {
    const client = new popCore.RPCClient({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: config.endpoint,
      apiVersion: config.apiVersion,
    });
    const requestOption = {
      method: 'POST',
    };
    await client.request('SendSms', params, requestOption);
  }

  __prefix0(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }
};
