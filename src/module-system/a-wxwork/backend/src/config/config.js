
const jsApiList = [
  'checkJsApi',
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareWeibo',
  // 'onMenuShareTimeline',
  // 'onMenuShareAppMessage',
  // 'onMenuShareQQ',
  // 'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard',
];

module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    contacts: {
      path: 'contacts/queue',
    },
  };

  // middlewares
  config.middlewares = {
    wxwork: {
      global: false,
      dependencies: 'instance',
    },
    wechatMini: {
      global: false,
      dependencies: 'instance',
    },
    inWechat: {
      global: false,
      dependencies: 'instance',
    },
    inWechatMini: {
      global: false,
      dependencies: 'instance',
    },
  };

  // account
  config.account = {};

  // account.wxwork
  config.account.wxwork = {
    corpid: '',
    apps: {
      selfBuilt: {
        agentId: '',
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
        message: {
          reply: {
            default: 'You are welcome!',
          },
        },
        jssdk: {
          debug: false,
          jsApiList,
        },
      },
      contacts: {
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
      },
    },
  };

  // account.mini
  config.account.mini = {
    appID: '',
    appSecret: '',
    token: appInfo.name,
    encodingAESKey: '',
  };

  return config;
};
