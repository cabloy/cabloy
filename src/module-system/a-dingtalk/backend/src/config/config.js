
const jsApiList = [
  'device.base.getUUID',
  'device.base.getInterface',
  'device.nfc.nfcWrite',
  'runtime.permission.requestOperateAuthCode',
  'biz.util.scanCard',
  'device.geolocation.get',
  'device.geolocation.start',
  'device.geolocation.stop',
  'biz.map.locate',
  'biz.map.search',
  'biz.map.view',
  'biz.clipboardData.setData',
  'biz.util.ut',
  'biz.util.open',
  'biz.telephone.call',
  'biz.telephone.showCallMenu',
  'biz.telephone.checkBizCall',
  'biz.telephone.quickCallList',
  'biz.ding.create',
  'biz.ding.post',
  'biz.contact.choose',
  'biz.contact.chooseMobileContacts',
  'biz.contact.complexPicker',
  'biz.contact.departmentsPicker',
  'biz.contact.createGroup',
  'biz.contact.setRule',
  'biz.contact.externalComplexPicker',
  'biz.contact.externalEditForm',
  'biz.customContact.choose',
  'biz.customContact.multipleChoose',
  'biz.chat.pickConversation',
  'biz.chat.chooseConversationByCorpId',
  'biz.chat.openSingleChat',
  'biz.chat.toConversation',
  'biz.cspace.saveFile',
  'biz.cspace.preview',
  'biz.cspace.chooseSpaceDir',
  'biz.util.uploadAttachment',
  'device.audio.startRecord',
  'device.audio.stopRecord',
  'device.audio.onRecordEnd',
  'device.audio.download',
  'device.audio.play',
  'device.audio.pause',
  'device.audio.resume',
  'device.audio.stop',
  'device.audio.onPlayEnd',
  'device.audio.translateVoice',
  'biz.conference.videoConfCall',
  'biz.alipay.pay',
  'biz.util.encrypt',
  'biz.util.decrypt',
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
    dingtalk: {
      global: false,
      dependencies: 'instance',
    },
    inDingtalk: {
      global: false,
      dependencies: 'instance',
    },
  };

  // sync
  config.sync = {
    department: {
      roleContainer: 'internal',
      roleTop: 'dingtalk',
    },
  };

  // account
  config.account = {};

  // account.dingtalk
  config.account.dingtalk = {
    corpid: '',
    ssosecret: '',
    // apps
    apps: {
      selfBuilt: {
        agentid: '',
        appkey: '',
        appsecret: '',
        token: appInfo.name,
        encodingAESKey: '',
        jssdk: {
          jsApiList,
        },
      },
    },
    // webs
    webs: {
      default: {
        appkey: '', // means: appid
        appsecret: '',
      },
    },
    // minis
    minis: {
      default: {
        agentid: '',
        appkey: '',
        appsecret: '',
      },
    },
  };

  return config;
};
