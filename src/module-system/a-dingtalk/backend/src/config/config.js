
const jsApiList = [
  'checkJsApi',
  'agentConfig',
  'onMenuShareWechat',
  // 'onMenuShareTimeline',
  // 'onMenuShareAppMessage',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocalImgData',
  'getNetworkType',
  'onNetworkStatusChange',
  'openLocation',
  'getLocation',
  'startAutoLBS',
  'stopAutoLBS',
  'onLocationChange',
  'onHistoryBack',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'openDefaultBrowser',
  'scanQRCode',
  'selectEnterpriseContact',
  'openEnterpriseChat',
  'chooseInvoice',
  'selectExternalContact',
  'getCurExternalContact',
  'openUserProfile',
  'shareAppMessage',
  'shareWechatMessage',
  'startWifi',
  'stopWifi',
  'connectWifi',
  'getWifiList',
  'onGetWifiList',
  'onWifiConnected',
  'getConnectedWifi',
  'setClipboardData',
];

const jsApiListAgent = [
  'onMenuShareWechat',
  // 'onMenuShareTimeline',
  // 'onMenuShareAppMessage',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocalImgData',
  'getNetworkType',
  'onNetworkStatusChange',
  'openLocation',
  'getLocation',
  'startAutoLBS',
  'stopAutoLBS',
  'onLocationChange',
  'onHistoryBack',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'openDefaultBrowser',
  'scanQRCode',
  'selectEnterpriseContact',
  'openEnterpriseChat',
  'chooseInvoice',
  'selectExternalContact',
  'getCurExternalContact',
  'openUserProfile',
  'shareAppMessage',
  'shareWechatMessage',
  'startWifi',
  'stopWifi',
  'connectWifi',
  'getWifiList',
  'onGetWifiList',
  'onWifiConnected',
  'getConnectedWifi',
  'setClipboardData',
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
    inWxwork: {
      global: false,
      dependencies: 'instance',
    },
  };

  // sync
  config.sync = {
    department: {
      roleContainer: 'internal',
      roleTop: 'wxwork',
    },
  };

  // account
  config.account = {};

  // account.wxwork
  config.account.wxwork = {
    corpid: '',
    // apps
    apps: {
      selfBuilt: {
        agentid: '',
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
        jssdkAgent: {
          jsApiList: jsApiListAgent,
        },
      },
      contacts: {
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
      },
    },
    // minis
    minis: {
      default: {
        secret: '',
        appID: '',
        appSecret: '',
      },
    },
  };

  return config;
};
