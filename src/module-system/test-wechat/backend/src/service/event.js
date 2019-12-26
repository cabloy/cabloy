const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {

  class Event extends app.Service {

    async wechatMessage({ event, data }) {
      const message = data.message;
      if (message.MsgType === 'text') {
        event.break = true;
        return {
          ToUserName: message.FromUserName,
          FromUserName: message.ToUserName,
          CreateTime: new Date().getTime(),
          MsgType: 'text',
          Content: `${this.ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`,
        };
      }
    }

    async wechatMessageMini({ event, data }) {
      const message = data.message;
      if (message.MsgType === 'text') {
        event.break = true;
        // todo: https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN
        // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/customer-message/customerServiceMessage.send.html
        const messageOut = {
          touser: message.FromUserName,
          msgtype: 'text',
          text: {
            content: `${this.ctx.text.locale('zh-cn', 'Reply')}: ${message.Content}`,
          },
        };

      }
    }

    async loginInfo({ /* event,*/ data }) {
      const info = data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-wechat' && provider.providerName === 'wechat') {
        info.config = extend(true, info.config, {
          modules: {
            'a-layoutmobile': {
              layout: {
                login: '/a/login/login',
                loginOnStart: true,
                toolbar: {
                  tabbar: true, labels: true, bottomMd: true,
                },
                tabs: [
                  { name: 'Test', tabLinkActive: true, iconMaterial: 'group_work', url: '/test/wechat/test/index' },
                  { name: 'Home', tabLinkActive: false, iconMaterial: 'home', url: '/a/base/menu/list' },
                  { name: 'Mine', tabLinkActive: false, iconMaterial: 'person', url: '/a/user/user/mine' },
                ],
              },
            },
          },
        });
      }
    }

  }

  return Event;
};
