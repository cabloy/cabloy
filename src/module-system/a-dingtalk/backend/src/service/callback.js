const require3 = require('require3');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Callback extends app.Service {

    async index({ message }) {
      // config
      const config = this.ctx.config.account.wxwork;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // res
      let res;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          // donothing，具体逻辑在通讯录回调通知中实现
          return null;
        } else if (message.Event === 'unsubscribe') {
          // donothing，具体逻辑在通讯录回调通知中实现
          return null;
        }
      }
      // raise event
      const res2 = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wxworkMessage',
        data: { message },
      });
      if (res2) res = res2;
      // check if ready
      if (res) return res;
      // default reply
      if (message.MsgType !== 'event') {
        return {
          ToUserName: message.FromUserName,
          FromUserName: message.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: configAppSelfBuilt.message.reply.default,
        };
      }
      return null;
    }

    async registerList() {
      // config
      const config = this.ctx.config.account.dingtalk.apps.selfBuilt.businessCallback;
      const host = config.host;
      const token = config.token;
      const encodingAESKey = config.encodingAESKey;
      const callbackList = config.list;
      const callbackUrl = `${this.ctx.meta.base.protocol}://${this.ctx.meta.base.host}/api/a/dingtalk/callback/index`;
      // check
      if (this.ctx.meta.base.host !== host || !token || !encodingAESKey || !callbackList) return;
      // check status
      const res = await this._tryGetList();
      if (!res) {
        // register
        await this.ctx.meta.dingtalk.app.selfBuilt.callback.register_call_back({
          call_back_tag: callbackList,
          token,
          aes_key: encodingAESKey,
          url: callbackUrl,
        });
      } else {
        // update
      }
    }

    async _tryGetList() {
      try {
        return await this.ctx.meta.dingtalk.app.selfBuilt.callback.get_call_back();
      } catch (err) {
        if (err.code === 71007) return null;
        throw err;
      }
    }

    async contacts({ message }) {
      // queue
      this.ctx.app.meta.queue.push({
        locale: this.ctx.locale,
        subdomain: this.ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'changeContact',
          message,
        },
      });
      // ok
      return null;
    }

  }

  return Callback;
};
