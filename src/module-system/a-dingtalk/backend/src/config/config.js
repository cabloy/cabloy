
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

const businessCallbackList = [
  // 通讯录
  'user_add_org',
  'user_modify_org',
  'user_leave_org',
  'user_active_org',
  'org_admin_add',
  'org_admin_remove',
  'org_dept_create',
  'org_dept_modify',
  'org_dept_remove',
  'org_remove',
  'org_change',
  'label_user_change',
  'label_conf_add',
  'label_conf_del',
  'label_conf_modify',
  // 审批
  'bpms_task_change',
  'bpms_instance_change',
  // 群会话
  'chat_add_member',
  'chat_remove_member',
  'chat_quit',
  'chat_update_owner',
  'chat_update_title',
  'chat_disband',
  // 签到
  'check_in',
  // 考勤
  'attendance_check_record',
  'attendance_schedule_change',
  'attendance_overtime_duration',
  // 会议室
  'meetingroom_book',
  'meetingroom_room_info',
];

module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    contacts: {
      path: 'contacts/queue',
    },
  };

  // startups
  config.startups = {
    registerBusinessCallbackList: {
      instance: true,
      path: 'callback/registerList',
      debounce: true,
      after: true,
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
        jssdk: {
          jsApiList,
        },
        businessCallback: {
          host: '',
          token: appInfo.name,
          encodingAESKey: '',
          list: businessCallbackList,
        },
      },
    },
    // webs
    webs: {
      default: {
        appid: '',
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
