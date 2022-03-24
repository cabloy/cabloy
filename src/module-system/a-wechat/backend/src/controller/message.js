const require3 = require('require3');
const WechatCrypto = require3('wechat-crypto');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageController extends app.Controller {
    get localUtils() {
      return this.ctx.bean.local.utils;
    }

    async index() {
      // providerName
      const providerName = this.ctx.params.providerName;
      // providerScene
      let providerScene = this.ctx.params.providerScene || 'default';
      // wechat/wechatmini
      if (providerName === 'wechat') providerScene = null;
      if (providerName === 'wechatmini' && providerScene === 'index') providerScene = 'default';
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName,
        providerScene,
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // handle message
      await this._handleMessage(beanProvider, async ({ message }) => {
        return await this.ctx.service.message.general({ beanProvider, message });
      });
    }

    async _handleMessage(beanProvider, handler) {
      // query
      const query = this.ctx.query;
      // config
      const config = beanProvider.configProviderScene;
      // encrypted
      const encrypted = query.encrypt_type === 'aes';
      // wechat crypto
      const wechatCrypto = encrypted
        ? new WechatCrypto(config.message.token, config.message.encodingAESKey, config.appID)
        : null;
      // parse
      let messageIn;
      if (this.ctx.method === 'GET') {
        messageIn = await this._parseMessageGet({ query, config, encrypted, wechatCrypto });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = messageIn.echostr;
      } else {
        const contentTypeXML = (this.ctx.headers['content-type'] || '').indexOf('text/xml') > -1;
        if (contentTypeXML) {
          messageIn = await this._parseMessagePostXML({ query, config, encrypted, wechatCrypto });
        } else {
          messageIn = await this._parseMessagePostJSON({ query, config, encrypted, wechatCrypto });
        }
        // handle
        let resXML;
        const messageOut = await handler({ message: messageIn });
        if (!messageOut) {
          resXML = '';
        } else {
          resXML = this.localUtils.buildXML({ xml: messageOut });
          if (encrypted) {
            const wrap = {};
            wrap.Encrypt = wechatCrypto.encrypt(resXML);
            wrap.TimeStamp = this.localUtils.createTimestamp();
            wrap.Nonce = this.localUtils.createNonceStr();
            wrap.MsgSignature = wechatCrypto.getSignature(wrap.TimeStamp, wrap.Nonce, wrap.Encrypt);
            resXML = this.localUtils.buildXML({ xml: wrap });
          }
        }
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/xml';
        this.ctx.body = resXML;
      }
    }

    async _parseMessageGet({ query, config, encrypted, wechatCrypto }) {
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, query.echostr);
      } else {
        valid =
          query.signature ===
          this.localUtils.calcSignature({ options: [config.message.token, query.timestamp, query.nonce].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(query.echostr);
        return { echostr: res.message };
      }
      return { echostr: query.echostr };
    }

    async _parseMessagePostXML({ query, config, encrypted, wechatCrypto }) {
      // xml raw
      let xmlRaw;
      if (typeof this.ctx.request.body === 'string') {
        xmlRaw = this.ctx.request.body;
      } else {
        const payload = await this.ctx.getPayload();
        xmlRaw = payload.toString();
      }
      // parse xml
      let messageIn = await this.localUtils.parseXML({ xml: xmlRaw });
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, messageIn.Encrypt);
      } else {
        valid =
          query.signature ===
          this.localUtils.calcSignature({ options: [config.message.token, query.timestamp, query.nonce].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(messageIn.Encrypt);
        messageIn = await this.localUtils.parseXML({ xml: res.message });
      }
      return messageIn;
    }

    async _parseMessagePostJSON({ query, config, encrypted, wechatCrypto }) {
      let messageIn = this.ctx.request.body;
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, messageIn.Encrypt);
      } else {
        valid =
          query.signature ===
          this.localUtils.calcSignature({ options: [config.message.token, query.timestamp, query.nonce].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(messageIn.Encrypt);
        messageIn = JSON.parse(res.message);
      }
      return messageIn;
    }
  }
  return MessageController;
};
