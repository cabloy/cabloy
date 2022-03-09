/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const DingtalkAPI = require3('@zhennann/node-dingtalk');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  // ctx.bean.dingtalk.app.selfBuilt
  // ctx.bean.dingtalk.admin
  // ctx.bean.dingtalk.web.default
  // ctx.bean.dingtalk.mini.default
  // ctx.bean.dingtalk.util
  return function () {
    return new Proxy(
      {},
      {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'app') {
            // app
            obj[prop] = new Proxy(
              {},
              {
                get(obj, prop) {
                  if (!obj[prop]) {
                    obj[prop] = _createDingtalkApiApp({ appName: prop });
                  }
                  return obj[prop];
                },
              }
            );
          } else if (prop === 'admin') {
            obj[prop] = _createDingtalkApiAdmin();
          } else if (prop === 'web') {
            // web
            obj[prop] = new Proxy(
              {},
              {
                get(obj, prop) {
                  if (!obj[prop]) {
                    obj[prop] = _createDingtalkApiWeb({ webName: prop });
                  }
                  return obj[prop];
                },
              }
            );
          } else if (prop === 'mini') {
            // mini
            obj[prop] = new Proxy(
              {},
              {
                get(obj, prop) {
                  if (!obj[prop]) {
                    obj[prop] = _createDingtalkApiMini({ sceneShort: prop });
                  }
                  return obj[prop];
                },
              }
            );
          } else if (prop === 'util') {
            // util
            obj[prop] = _createDingtalkApiUtil();
          }
          return obj[prop];
        },
      }
    );
  };

  function _createDingtalkApiGeneral({ category, appName, appkey, appsecret, corpid, sso }) {
    // api
    const api = new DingtalkAPI(
      {
        appkey,
        appsecret,
        corpid,
        sso,
        // logger: console,
      },
      async function () {
        const cacheKey = `dingtalk-token:${category}:${appName || ''}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function (token) {
        const cacheKey = `dingtalk-token:${category}:${appName || ''}`;
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
      }
    );
    // registerTicketHandle
    api.client.registerTicketHandle(
      async function (type) {
        const cacheKey = `dingtalk-jsticket:${category}:${appName}:${type}`;
        return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
      },
      async function (type, token) {
        const cacheKey = `dingtalk-jsticket:${category}:${appName}:${type}`;
        if (token) {
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        } else {
          await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
        }
      }
    );
    // ready
    return api;
  }

  function _createDingtalkApiApp({ appName }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    const configApp = config.apps[appName];
    return _createDingtalkApiGeneral({
      category: 'app',
      appName,
      appkey: configApp.appkey,
      appsecret: configApp.appsecret,
      corpid: config.corpid,
    });
  }

  function _createDingtalkApiAdmin() {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    return _createDingtalkApiGeneral({
      category: 'admin',
      appName: '',
      appkey: config.corpid,
      appsecret: config.ssosecret,
      corpid: config.corpid,
      sso: true,
    });
  }

  function _createDingtalkApiWeb({ webName }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    const configWeb = config.webs[webName];
    return _createDingtalkApiGeneral({
      category: 'web',
      appName: webName,
      appkey: configWeb.appid,
      appsecret: configWeb.appsecret,
      corpid: config.corpid,
    });
  }

  function _createDingtalkApiMini({ sceneShort }) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    const configMini = config.minis[sceneShort];
    return _createDingtalkApiGeneral({
      category: 'mini',
      appName: sceneShort,
      appkey: configMini.appkey,
      appsecret: configMini.appsecret,
      corpid: config.corpid,
    });
  }

  function _createDingtalkApiUtil() {
    return {
      // scene: empty/dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini/dingtalkminidefault/xxx,xxx,xxx
      in(scene) {
        // scene
        if (!scene) scene = 'dingtalk';
        if (typeof scene === 'string') scene = scene.split(',');
        // provider
        const provider = ctx.state.user && ctx.state.user.provider;
        if (!provider || provider.module !== moduleInfo.relativeName) return false;
        // find any match
        for (const item of scene) {
          const ok =
            provider.providerName === item || (item === 'dingtalkmini' && provider.providerName.indexOf(item) > -1);
          if (ok) return true;
        }
        // not found
        return false;
      },
    };
  }
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class eventBean {
    async execute(context, next) {
      const data = context.data;
      // aDingtalkMember
      await ctx.model.query('update aDingtalkMember a set a.userId=? where a.iid=? and a.userId=?', [
        data.userIdTo,
        ctx.instance.id,
        data.userIdFrom,
      ]);
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 427:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const extend = require3('extend2');

module.exports = ctx => {
  class eventBean {
    async execute(context, next) {
      const info = context.data.info;
      const provider = info.user && info.user.provider;
      if (provider && provider.module === 'a-dingtalk') {
        info.config = extend(true, info.config, {
          modules: {},
        });
      }
      // next
      await next();
    }
  }

  return eventBean;
};


/***/ }),

/***/ 500:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {
    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // toAllUser
      const toAllUser = content.toAllUser || false;
      // userIds / roleIds
      const userIds = content.userIds;
      const roleIds = content.roleIds;
      // message
      const message = {
        ...content.data,
      };
      // agentid
      const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
      message.agent_id = config.apps.selfBuilt.agentid;
      if (toAllUser) {
        message.to_all_user = true;
      } else {
        // userIds
        if (userIds && userIds.length > 0) {
          const modelMember = ctx.model.module(moduleInfo.relativeName).member;
          const list = await modelMember.select({
            where: { userId: userIds },
            columns: ['memberId'],
          });
          message.userid_list = list.map(item => item.memberId).join(',');
        }
        // roleIds
        if (roleIds && roleIds.length > 0) {
          const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
          const list = await modelDepartment.select({
            where: { roleId: roleIds },
            columns: ['departmentId'],
          });
          message.dept_id_list = list.map(item => item.departmentId).join(',');
        }
      }
      // send
      await ctx.bean.dingtalk.app.selfBuilt.message.sendMessage(message);
      // done
      return true;
    }
  }
  return IOChannel;
};


/***/ }),

/***/ 396:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      if (!ctx.bean.dingtalk.util.in(options.scene)) return ctx.throw.module(moduleInfo.relativeName, 1001);
      // next
      await next();
    }
  }
  return Middleware;
};


/***/ }),

/***/ 942:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const data = context.data;
      const queueAction = data.queueAction;
      if (queueAction === 'sync') {
        await this.ctx.service.contacts.queueSync(data);
      } else if (queueAction === 'changeContact') {
        await this.ctx.service.contacts.queueChangeContact(data);
      }
    }
  }

  return Queue;
};


/***/ }),

/***/ 188:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const dingtalkUtils = __webpack_require__(474);

module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // config
      const config = this.ctx.config.account.dingtalk.apps.selfBuilt.businessCallback;
      const host = config.host;
      const token = config.token;
      const encodingAESKey = config.encodingAESKey;
      const callbackList = config.list;
      const callbackUrl = this.ctx.bean.base.getAbsoluteUrl('/api/a/dingtalk/callback/index');
      // check if valid
      if (this.ctx.bean.base.host !== host || !token || !encodingAESKey || !callbackList) return;
      // check status
      const res = await this._tryGetList();
      if (!res) {
        // register
        await this.ctx.bean.dingtalk.app.selfBuilt.callback.register_call_back({
          call_back_tag: callbackList,
          token,
          aes_key: encodingAESKey,
          url: callbackUrl,
        });
      } else {
        // update
        const call_back_tag_setRemote = new Set(res.call_back_tag);
        const call_back_tag_setConfig = new Set(callbackList);
        const diff = dingtalkUtils.symmetricDifference(call_back_tag_setRemote, call_back_tag_setConfig);
        if (diff.size === 0) {
          // do nothing
        } else {
          // difference
          await this.ctx.bean.dingtalk.app.selfBuilt.callback.update_call_back({
            call_back_tag: callbackList,
            token,
            aes_key: encodingAESKey,
            url: callbackUrl,
          });
        }
      }
    }

    async _tryGetList() {
      try {
        return await this.ctx.bean.dingtalk.app.selfBuilt.callback.get_call_back();
      } catch (err) {
        if (err.code === 71007) return null;
        throw err;
      }
    }
  }

  return Startup;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aDingtalkDepartment
        sql = `
          CREATE TABLE aDingtalkDepartment (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            departmentId int(11) DEFAULT '0',
            departmentParentId int(11) DEFAULT '0',
            departmentName varchar(255) DEFAULT NULL,
            departmentOrder int(11) DEFAULT '0',
            createDeptGroup int(11) DEFAULT '0',
            autoAddUser int(11) DEFAULT '0',
            deptHiding int(11) DEFAULT '0',
            deptPermits TEXT DEFAULT NULL,
            userPermits TEXT DEFAULT NULL,
            outerDept int(11) DEFAULT '0',
            outerPermitDepts TEXT DEFAULT NULL,
            outerPermitUsers TEXT DEFAULT NULL,
            outerDeptOnlySelf int(11) DEFAULT '0',
            sourceIdentifier varchar(255) DEFAULT NULL,
            ext JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aDingtalkMember
        sql = `
          CREATE TABLE aDingtalkMember (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            memberId varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            active int(11) DEFAULT '0',
            avatar varchar(255) DEFAULT NULL,
            orderInDepts text DEFAULT NULL,
            department varchar(255) DEFAULT NULL,
            position varchar(255) DEFAULT NULL,
            mobile varchar(255) DEFAULT NULL,
            tel varchar(255) DEFAULT NULL,
            workPlace varchar(255) DEFAULT NULL,
            remark TEXT DEFAULT NULL,
            email varchar(255) DEFAULT NULL,
            orgEmail varchar(255) DEFAULT NULL,
            jobnumber varchar(255) DEFAULT NULL,
            isHide int(11) DEFAULT '0',
            isSenior int(11) DEFAULT '0',
            extattr JSON DEFAULT NULL,
            hiredDate timestamp DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const eventLoginInfo = __webpack_require__(427);
const eventAccountMigration = __webpack_require__(836);
const queueContacts = __webpack_require__(942);
const startupRegisterBusinessCallbackList = __webpack_require__(188);
const middlewareInDingtalk = __webpack_require__(396);
const ioChannelApp = __webpack_require__(500);
const beanDingtalk = __webpack_require__(697);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.loginInfo': {
      mode: 'ctx',
      bean: eventLoginInfo,
    },
    'event.accountMigration': {
      mode: 'ctx',
      bean: eventAccountMigration,
    },
    // queue
    'queue.contacts': {
      mode: 'app',
      bean: queueContacts,
    },
    // startup
    'startup.registerBusinessCallbackList': {
      mode: 'app',
      bean: startupRegisterBusinessCallbackList,
    },
    // middleware
    'middleware.inDingtalk': {
      mode: 'ctx',
      bean: middlewareInDingtalk,
    },
    // io
    'io.channel.app': {
      mode: 'ctx',
      bean: ioChannelApp,
    },
    // global
    dingtalk: {
      mode: 'ctx',
      bean: beanDingtalk,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 591:
/***/ ((module) => {

const _scenes = {
  dingtalk: {
    scene: 'dingtalk',
    authProvider: 'dingtalk',
    title: 'DingTalk',
    client: 'dingtalk',
  },
  dingtalkweb: {
    scene: 'dingtalkweb',
    authProvider: 'dingtalkweb',
    title: 'DingTalk Web',
    client: 'dingtalkweb',
  },
  dingtalkadmin: {
    scene: 'dingtalkadmin',
    authProvider: 'dingtalkadmin',
    title: 'DingTalk Admin',
    client: 'dingtalkadmin',
  },
  dingtalkmini: {
    scene: 'dingtalkmini',
    authProvider: 'dingtalkmini',
    title: 'DingTalk Miniprogram',
  },
};

function _upperCaseFirstChar(str) {
  if (!str) return '';
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

module.exports = {
  scenes: _scenes,
  getScene(scene) {
    if (scene.indexOf('dingtalkmini') > -1) {
      const sceneShort = scene.substr('dingtalkmini'.length);
      // dingtalkmini
      const base = _scenes.dingtalkmini;
      return {
        scene,
        authProvider: scene,
        title: `${base.title} - ${_upperCaseFirstChar(sceneShort)}`,
      };
    }
    // else
    return _scenes[scene];
  },
};


/***/ }),

/***/ 154:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const bb = require3('bluebird');
const extend = require3('extend2');
const authProviderScenes = __webpack_require__(591);

module.exports = function (ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DingtalkHelper {
    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    // scene: dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini
    async verifyAuthUser({ scene, memberId, member, cbVerify, state, needLogin = true }) {
      // userInfo(member)
      if (!member) {
        member = await this._getMemberByMemberId({ memberId });
        if (!member) return ctx.throw.module(moduleInfo.relativeName, 1008);
      }
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, memberId: member.memberId, member });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.bean.user.verify({ state, profileUser });
        if (needLogin) {
          await ctx.login(verifyUser);
        }
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // ok
      return verifyUser;
    }

    async _getMemberByMemberId({ memberId }) {
      // model member
      const modelMember = ctx.model.module(moduleInfo.relativeName).member;
      return await modelMember.get({ memberId });
    }

    // profileId: dingtalk:memberId
    async _ensureAuthUser({ scene, memberId, member }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName);
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const profileId = `dingtalk:${memberId}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
          userName: member.name,
          realName: member.name,
          avatar: member.avatar,
          email: member.email,
          mobile: member.mobile,
          emailConfirmed: true,
          mobileVerified: true,
          profile: member,
        },
        autoActivate: config.auth.autoActivate,
      };
      // provider
      const providerItem = await ctx.bean.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: sceneInfo.authProvider,
      });
      // check auth
      let authId;
      let authUserId;
      const authItems = await ctx.model.query(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId=?',
        [ctx.instance.id, providerItem.id, profileId]
      );
      const authItem = authItems[0];
      if (!authItem) {
        // always set avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        delete _profile.avatar;
        // insert auth
        const res = await modelAuth.insert({
          providerId: providerItem.id,
          profileId,
          profile: JSON.stringify(_profile),
        });
        authId = res.insertId;
      } else {
        // hold old avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        const _profileOld = JSON.parse(authItem.profile);
        _profile.avatar = _profileOld.avatar;
        // always update
        await modelAuth.update({
          id: authItem.id,
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for memberId
      const _authOthers = await ctx.model.query(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId=? and a.id<>?',
        [ctx.instance.id, profileId, authId]
      );
      const _authOther = _authOthers[0];
      if (_authOther && _authOther.userId !== authUserId) {
        // update userId for this auth
        await modelAuth.update({ id: authId, userId: _authOther.userId });
      }
      // ready
      return profileUser;
    }
  }

  return DingtalkHelper;
};


/***/ }),

/***/ 474:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const crypto = __webpack_require__(113);

module.exports = {
  createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  },
  createTimestamp() {
    return '' + Date.now();
  },
  calcSignature({ options, join = '', hash = 'sha1' }) {
    const hashsum = crypto.createHash(hash);
    hashsum.update(options.join(join));
    return hashsum.digest('hex');
  },
  symmetricDifference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB) {
      if (_difference.has(elem)) {
        _difference.delete(elem);
      } else {
        _difference.add(elem);
      }
    }
    return _difference;
  },
};


/***/ }),

/***/ 76:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const jsApiList = __webpack_require__(537);
const businessCallbackList = __webpack_require__(779);

module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    contacts: {
      bean: 'contacts',
      transaction: true,
    },
  };

  // startups
  config.startups = {
    registerBusinessCallbackList: {
      bean: 'registerBusinessCallbackList',
      instance: true,
      debounce: true,
      after: true,
    },
  };

  // middlewares
  config.middlewares = {
    inDingtalk: {
      bean: 'inDingtalk',
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

  // auth
  config.auth = {
    autoActivate: true,
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
          type: 0,
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

  // settings
  config.settings = {
    instance: {
      groupInfo: {
        sendLinkAccountMigration: false,
      },
      groupFunction: {},
    },
  };

  return config;
};


/***/ }),

/***/ 779:
/***/ ((module) => {

module.exports = [
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


/***/ }),

/***/ 537:
/***/ ((module) => {

module.exports = [
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


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Not In DingTalk',
  1002: 'Not In DingTalk Miniprogram',
  1003: 'Role not Found for department: %d',
  1004: 'Department not Found: %d',
  1005: 'Member not Found: %d',
  1006: 'Sync Departments First',
  1007: 'Sync Members First',
  1008: 'Sync Contacts First',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  AccountMigration: 'Account Migration',
  AccountMigrationDesp: 'Click this link to migrate to the existed account',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  DingTalk: '钉钉',
  AccountMigration: '账户迁移',
  AccountMigrationDesp: '点击此链接迁移至现有账户',
  'DingTalk Miniprogram': '钉钉小程序',
  'DingTalk Miniprogram - Default': '钉钉小程序 - 默认',
  'DingTalk Web': '钉钉Web',
  'DingTalk Admin': '钉钉后台管理',
  'Not In DingTalk': '不在钉钉内部',
  'Not In DingTalk Miniprogram': '不在钉钉小程序内部',
  'Contacts Management': '通讯录管理',
  'Sync Started': '同步已启动',
  'Sync Completed': '同步已完成',
  'Department Count': '部门数量',
  'Member Count': '成员数量',
  'Sync Departments First': '请先同步部门',
  'Sync Members First': '请先同步成员',
  'Sync Contacts First': '请先同步通讯录',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 466:
/***/ ((module) => {

module.exports = app => {
  const ChannelApp = {
    info: {
      bean: 'app',
      title: 'App Message',
    },
  };
  return ChannelApp;
};


/***/ }),

/***/ 418:
/***/ ((module) => {

module.exports = app => {
  const progress = {
    info: {
      title: 'Progress',
      persistence: true,
    },
  };
  return progress;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};

  // settings instance
  schemas.settingsInstance = {
    type: 'object',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          sendLinkAccountMigration: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'SendLinkAccountMigration',
          },
        },
      },
      groupFunction: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Function Group',
        properties: {
          linkContacts: {
            ebType: 'link',
            ebTitle: 'Contacts Management',
            ebParams: {
              href: 'contacts/management',
              target: '_self',
            },
          },
        },
      },
    },
  };

  return schemas;
};


/***/ }),

/***/ 523:
/***/ ((module) => {

module.exports = app => {
  class AuthController extends app.Controller {
    async login() {
      const res = await this.service.auth.login({
        scene: this.ctx.request.body.scene,
        code: this.ctx.request.body.code,
        state: this.ctx.request.body.state,
      });
      this.ctx.success(res);
    }

    async loginMini() {
      const res = await this.service.auth.login({
        scene: `dingtalkmini${this.ctx.request.body.scene}`,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};


/***/ }),

/***/ 416:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const DingTalkEncryptor = require3('dingtalk-encrypt');
const dingtalkUtils = __webpack_require__(474);

module.exports = app => {
  class CallbackController extends app.Controller {
    async index() {
      await this._handleMessage('selfBuilt', async ({ message }) => {
        return await this.ctx.service.callback.index({ message });
      });
    }

    async _handleMessage(appName, handler) {
      // query
      const query = this.ctx.query;
      // config
      const config = this.ctx.config.account.dingtalk;
      const configApp = config.apps[appName];
      // dingtalk crypto
      const encryptor = new DingTalkEncryptor(
        configApp.businessCallback.token,
        configApp.businessCallback.encodingAESKey,
        config.corpid
      );
      // parse
      const message = await this._parseMessagePost({ query, encryptor });
      // handle
      await handler({ message });
      // ok
      const res = encryptor.getEncryptedMap('success', dingtalkUtils.createTimestamp(), dingtalkUtils.createNonceStr());
      this.ctx.status = 200;
      this.ctx.type = 'application/json';
      this.ctx.body = res;
    }

    async _parseMessagePost({ query, encryptor }) {
      const plainText = encryptor.getDecryptMsg(
        query.signature,
        query.timestamp,
        query.nonce,
        this.ctx.request.body.encrypt
      );
      return JSON.parse(plainText);
    }
  }
  return CallbackController;
};


/***/ }),

/***/ 98:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const uuid = require3('uuid');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class ContactsController extends app.Controller {
    async sync() {
      // progress
      const progressId = uuid.v4().replace(/-/g, '');
      // queue
      this.ctx.meta.util.queuePush({
        module: moduleInfo.relativeName,
        queueName: 'contacts',
        data: {
          queueAction: 'sync',
          type: this.ctx.request.body.type,
          progressId,
          userOp: this.ctx.state.user.op,
        },
      });
      this.ctx.success({ progressId });
    }

    async syncStatus() {
      const res = await this.service.contacts.syncStatus();
      this.ctx.success(res);
    }
  }
  return ContactsController;
};


/***/ }),

/***/ 586:
/***/ ((module) => {

module.exports = app => {
  class JSSDKController extends app.Controller {
    async jsconfig() {
      const res = await this.service.jssdk.jsconfig({
        url: this.ctx.request.body.url,
      });
      this.ctx.success(res);
    }
  }
  return JSSDKController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const callback = __webpack_require__(416);
const contacts = __webpack_require__(98);

const jssdk = __webpack_require__(586);
const auth = __webpack_require__(523);

module.exports = app => {
  const controllers = {
    callback,
    contacts,
    jssdk,
    auth,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authFn = __webpack_require__(441);

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  // socketio
  const socketioMessageProgress = __webpack_require__(418)(app);
  const socketioChannelApp = __webpack_require__(466)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        settingsInstance: {
          schemas: 'settingsInstance',
        },
      },
      keywords: {},
      schemas: {
        settingsInstance: schemas.settingsInstance,
      },
    },
    settings: {
      instance: {
        validator: 'settingsInstance',
      },
    },
    event: {
      declarations: {},
      implementations: {
        'a-base:loginInfo': 'loginInfo',
        'a-base:accountMigration': 'accountMigration',
      },
    },
    socketio: {
      messages: {
        progress: socketioMessageProgress,
      },
      channels: {
        app: socketioChannelApp,
      },
    },
    auth: authFn,
  };
  return meta;
};


/***/ }),

/***/ 304:
/***/ ((module) => {

module.exports = app => {
  class Department extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDingtalkDepartment', options: { disableDeleted: true } });
    }
  }
  return Department;
};


/***/ }),

/***/ 841:
/***/ ((module) => {

module.exports = app => {
  class Member extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDingtalkMember', options: { disableDeleted: false } });
    }
  }
  return Member;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const department = __webpack_require__(304);
const member = __webpack_require__(841);

module.exports = app => {
  const models = {
    department,
    member,
  };
  return models;
};


/***/ }),

/***/ 441:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const strategy = __webpack_require__(947);
const DingtalkHelperFn = __webpack_require__(154);
const authProviderScenes = __webpack_require__(591);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  function _createProviderDingTalk() {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.apps.selfBuilt;
    if (!config.appkey || !config.appsecret) return null;
    return {
      meta: {
        title: 'DingTalk',
        mode: 'direct',
        disableAssociate: false,
        component: 'buttondingtalk',
      },
      config: {},
      handler: null,
    };
  }

  function _createProviderDingTalkWeb() {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.webs.default;
    if (!config.appid || !config.appsecret) return null;
    return {
      meta: {
        title: 'DingTalk Web',
        mode: 'redirect',
        disableAssociate: false,
        component: 'buttondingtalkweb',
      },
      config: {
        client: 'dingtalkweb',
        scope: 'snsapi_login',
      },
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.webs.default;
          return { appkey: config.appid, appsecret: config.appsecret };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, loginTmpCode, done) => {
            // ctx/state
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            // code/memberId
            const dingtalkHelper = new (DingtalkHelperFn(ctx))();
            const api = ctx.bean.dingtalk;
            api.web.default.client
              .getuserinfo_bycode(loginTmpCode)
              .then(res => {
                const unionid = res.user_info.unionid;
                api.app.selfBuilt.user
                  .getUseridByUnionid(unionid)
                  .then(res => {
                    if (res.contactType === 1) throw new Error('not support extcontact');
                    const memberId = res.userid;
                    dingtalkHelper
                      .verifyAuthUser({
                        scene: 'dingtalkweb',
                        memberId,
                        state,
                        cbVerify: (profileUser, cb) => {
                          app.passport.doVerify(req, profileUser, cb);
                        },
                      })
                      .then(verifyUser => {
                        done(null, verifyUser);
                      })
                      .catch(done);
                  })
                  .catch(done);
              })
              .catch(done);
          },
        };
      },
    };
  }

  function _createProviderDingTalkAdmin() {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
    if (!config.corpid || !config.ssosecret) return null;
    return {
      meta: {
        title: 'DingTalk Admin',
        mode: 'redirect',
        disableAssociate: true,
      },
      config: {},
      configFunctions: {
        getConfig(ctx) {
          const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
          return { appkey: config.corpid, appsecret: config.ssosecret };
        },
      },
      handler: app => {
        return {
          strategy,
          callback: (req, code, done) => {
            // ctx/state
            const ctx = req.ctx;
            const state = ctx.request.query.state || 'login';
            // code/memberId
            const dingtalkHelper = new (DingtalkHelperFn(ctx))();
            const api = ctx.bean.dingtalk;
            api.admin.client
              .getSSOUserInfo(null, code)
              .then(res => {
                const memberId = res.user_info.userid;
                dingtalkHelper
                  .verifyAuthUser({
                    scene: 'dingtalkadmin',
                    memberId,
                    state,
                    cbVerify: (profileUser, cb) => {
                      app.passport.doVerify(req, profileUser, cb);
                    },
                  })
                  .then(verifyUser => {
                    done(null, verifyUser);
                  })
                  .catch(done);
              })
              .catch(done);
          },
        };
      },
    };
  }

  function _createProviderMini(sceneInfo, sceneShort) {
    const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk.minis[sceneShort];
    if (!config.appkey || !config.appsecret) return null;
    return {
      meta: {
        title: sceneInfo.title,
        mode: 'direct',
        disableAssociate: true,
      },
      config: {},
      handler: null,
    };
  }

  const metaAuth = {
    providers: {},
  };

  // dingtalk
  metaAuth.providers.dingtalk = _createProviderDingTalk();
  // dingtalkweb
  metaAuth.providers.dingtalkweb = _createProviderDingTalkWeb();
  // dingtalkadmin
  metaAuth.providers.dingtalkadmin = _createProviderDingTalkAdmin();

  // minis
  const minis = ctx.config.module(moduleInfo.relativeName).account.dingtalk.minis;
  for (const sceneShort in minis) {
    const scene = `dingtalkmini${sceneShort}`;
    const sceneInfo = authProviderScenes.getScene(scene);
    metaAuth.providers[sceneInfo.authProvider] = _createProviderMini(sceneInfo, sceneShort);
  }

  // ok
  return metaAuth;
};


/***/ }),

/***/ 272:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const querystring = require3('querystring');

const OAuth = function (appkey) {
  this.appkey = appkey;
};

OAuth.prototype.getAuthorizeURLForWebsite = function (redirect, state) {
  const url = 'https://oapi.dingtalk.com/connect/qrconnect';
  const info = {
    appid: this.appkey,
    response_type: 'code',
    scope: 'snsapi_login',
    state: state || '',
    redirect_uri: redirect,
  };

  return url + '?' + querystring.stringify(info);
};

module.exports = OAuth;


/***/ }),

/***/ 947:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const util = require3('util');
const passport = require3('passport-strategy');
const OAuth = __webpack_require__(272);

function DingTalkStrategy(options, verify) {
  options = options || {};

  if (!verify) {
    throw new TypeError('DingTalkStrategy required a verify callback');
  }

  if (typeof verify !== 'function') {
    throw new TypeError('_verify must be function');
  }

  passport.Strategy.call(this, options, verify);

  this.name = options.name || 'dingtalk';
  this._client = options.client || 'dingtalk';
  this._verify = verify;
  this._callbackURL = options.callbackURL;
  this._lang = options.lang || 'en';
  this._state = options.state;
  this._scope = options.scope || 'snsapi_login';
  this._passReqToCallback = options.passReqToCallback;
}

util.inherits(DingTalkStrategy, passport.Strategy);

DingTalkStrategy.prototype.getOAuth = function (options) {
  const _config = options.getConfig();
  return new OAuth(_config.appkey);
};

DingTalkStrategy.prototype.authenticate = function (req, options) {
  if (!req._passport) {
    return this.error(new Error('passport.initialize() middleware not in use'));
  }

  const self = this;

  options = options || {};

  // oauth
  const _oauth = this.getOAuth(options);

  // 校验完成信息
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  // 获取code授权成功
  if (req.url.indexOf('/callback') > -1) {
    // 获取code,并校验相关参数的合法性
    // No code only state --> User has rejected send details. (Fail authentication request).
    if (req.query && !req.query.code) {
      return self.fail(401);
    }

    // Documentation states that if user rejects userinfo only state will be sent without code
    // In reality code equals "authdeny". Handle this case like the case above. (Fail authentication request).
    if (req.query && req.query.code === 'authdeny') {
      return self.fail(401);
    }

    const code = req.query.code;

    try {
      if (self._passReqToCallback) {
        self._verify(req, code, verified);
      } else {
        self._verify(code, verified);
      }
    } catch (ex) {
      return self.error(ex);
    }
  } else {
    const state = options.state || self._state;
    const callbackURL = options.callbackURL || self._callbackURL;
    const scope = options.scope || self._scope;

    // only support dingtalkweb
    const methodName = this._client === 'dingtalkweb' ? 'getAuthorizeURLForWebsite' : '';
    const location = _oauth[methodName](callbackURL, state, scope);

    self.redirect(location, 302);
  }
};

module.exports = DingTalkStrategy;


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // message
    { method: 'post', path: 'callback/index', controller: 'callback', meta: { auth: { enable: false } } },
    // contacts
    {
      method: 'post',
      path: 'contacts/sync',
      controller: 'contacts',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'contacts/syncStatus',
      controller: 'contacts',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },

    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },

    // auth
    { method: 'post', path: 'auth/login', controller: 'auth', meta: { auth: { enable: false } } },
    {
      method: 'post',
      path: 'authMini/login',
      controller: 'auth',
      action: 'loginMini',
      meta: { auth: { enable: false } },
    },
  ];
  return routes;
};


/***/ }),

/***/ 300:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const DingtalkHelperFn = __webpack_require__(154);

module.exports = app => {
  class Auth extends app.Service {
    async login({ scene, code, state }) {
      if (!scene || !code) return this.ctx.throw(403);
      // member
      const res = await this.ctx.bean.dingtalk.app.selfBuilt.user.getUserInfoByCode(code);
      const memberId = res.userid;
      // verify auth user
      const dingtalkHelper = new (DingtalkHelperFn(this.ctx))();
      await dingtalkHelper.verifyAuthUser({ state, scene: 'dingtalk', memberId });
      // echo
      return await this.ctx.bean.auth.echo();
    }
  }

  return Auth;
};


/***/ }),

/***/ 318:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Callback extends app.Service {
    async index({ message }) {
      // event: check_url
      if (message.EventType === 'check_url') {
        // just return
        return;
      } else if (message.EventType.indexOf('user_') === 0 || message.EventType.indexOf('org_dept_') === 0) {
        // user events or org events
        await this.contacts({ message });
      }
      // raise event
      await this.ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'dingtalkCallback',
        data: { message },
      });
    }

    async contacts({ message }) {
      // queue
      this.ctx.meta.util.queuePush({
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


/***/ }),

/***/ 67:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const DingtalkHelperFn = __webpack_require__(154);

// department

const __departmentFieldMap = [
  [
    'departmentId',
    'departmentParentId',
    'departmentName',
    'departmentOrder',
    'createDeptGroup',
    'autoAddUser',
    'deptHiding',
    'deptPermits',
    'userPermits',
    'outerDept',
    'outerPermitDepts',
    'outerPermitUsers',
    'outerDeptOnlySelf',
    'sourceIdentifier',
    'ext',
  ],
  [
    'id',
    'parentid',
    'name',
    'order',
    'createDeptGroup',
    'autoAddUser',
    'deptHiding',
    'deptPermits',
    'userPermits',
    'outerDept',
    'outerPermitDepts',
    'outerPermitUsers',
    'outerDeptOnlySelf',
    'sourceIdentifier',
    'ext',
  ],
  [
    'number',
    'number',
    'string',
    'number',
    'bool',
    'bool',
    'bool',
    'string',
    'string',
    'bool',
    'string',
    'string',
    'bool',
    'string',
    'string',
  ],
];

// member

const __memberFieldMap = [
  [
    'memberId',
    'name',
    'active',
    'avatar',
    'orderInDepts',
    'department',
    'position',
    'mobile',
    'tel',
    'workPlace',
    'remark',
    'email',
    'orgEmail',
    'jobnumber',
    'isHide',
    'isSenior',
    'extattr',
    'hiredDate',
  ],
  [
    'userid',
    'name',
    'active',
    'avatar',
    'orderInDepts',
    'department',
    'position',
    'mobile',
    'tel',
    'workPlace',
    'remark',
    'email',
    'orgEmail',
    'jobnumber',
    'isHide',
    'isSenior',
    'extattr',
    'hiredDate',
  ],
  [
    'string',
    'string',
    'bool',
    'string',
    'string',
    'array',
    'string',
    'string',
    'string',
    'string',
    'string',
    'string',
    'string',
    'string',
    'bool',
    'bool',
    'json',
    'timestamp',
  ],
];

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Contacts extends app.Service {
    async syncStatus() {
      const departments = await this.ctx.bean.status.get('syncDepartments');
      const members = await this.ctx.bean.status.get('syncMembers');
      return { departments, members };
    }

    async queueSync({ type, progressId, userOp }) {
      if (type === 'departments') {
        await this._queueSyncDepartments({ progressId, userOp });
      } else if (type === 'members') {
        await this._queueSyncMembers({ progressId, userOp });
      }
    }

    async queueChangeContact({ message }) {
      const syncStatus = await this.syncStatus();
      // console.log('------ type:', message.EventType);
      if (message.EventType.indexOf('org_dept_') === 0) {
        if (!syncStatus.departments) return this.ctx.throw(1006);
        await this._queueChangeContactDepartments({ message });
      } else if (message.EventType.indexOf('user_') === 0) {
        if (!syncStatus.members) return this.ctx.throw(1007);
        await this._queueChangeContactMembers({ message });
      }
    }

    async _queueChangeContactDepartments({ message }) {
      // console.log(message);
      for (const departmentId of message.DeptId) {
        await this._queueChangeContactDepartment({ message, departmentId });
      }
    }

    async _queueChangeContactDepartment({ message, departmentId }) {
      // department
      const department = { departmentId };
      if (message.EventType !== 'org_dept_remove') {
        const remoteDepartment = await this.ctx.bean.dingtalk.app.selfBuilt.department.get(departmentId);
        this._adjustFields(department, remoteDepartment, __departmentFieldMap);
      }
      // do
      if (message.EventType === 'org_dept_create') {
        // create
        await this._createRoleAndDepartment({ department });
        // build roles
        this._roleBuild();
      } else if (message.EventType === 'org_dept_modify') {
        // update
        await this._updateRoleAndDepartment({ localDepartment: null, department });
      } else if (message.EventType === 'org_dept_remove') {
        await this._deleteRoleAndDepartment({ localDepartment: null, department });
        // build roles
        this._roleBuild();
      }
    }

    async _queueChangeContactMembers({ message }) {
      for (const memberId of message.UserId) {
        await this._queueChangeContactMember({ message, memberId });
      }
    }

    async _queueChangeContactMember({ message, memberId }) {
      // member
      const member = { memberId };
      if (message.EventType !== 'user_leave_org') {
        const remoteMember = await this.ctx.bean.dingtalk.app.selfBuilt.user.get(memberId);
        this._adjustFields(member, remoteMember, __memberFieldMap);
      }
      // do
      if (message.EventType === 'user_add_org') {
        // add
        await this._createUserAndMember({ member });
      } else if (message.EventType === 'user_modify_org') {
        // update
        await this._updateUserAndMember({ localMember: null, member });
      } else if (message.EventType === 'user_leave_org') {
        await this._deleteUserAndMember({ localMember: null, member });
      } else if (message.EventType === 'user_active_org') {
        // same as update
        await this._updateUserAndMember({ localMember: null, member });
      }
    }

    // queue sync departments
    async _queueSyncDepartments({ progressId, userOp }) {
      // prepare context
      const context = {
        remoteDepartments: null,
        progressId,
        userOp,
      };
      try {
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // remote departments
        const res = await this.ctx.bean.dingtalk.app.selfBuilt.department.list({
          fetch_child: true,
          id: 1,
        });
        // special for departmentId=1
        const department1 = await this.ctx.bean.dingtalk.app.selfBuilt.department.get(1);
        res.department.splice(0, 0, department1);
        context.remoteDepartments = res.department;
        // console.log('-------all:', context.remoteDepartments);
        // progress
        await this._progressPublish({
          context,
          done: 0,
          text: `--- ${this.ctx.text('Department Count')}: ${context.remoteDepartments.length} ---`,
        });
        // local departments
        context.localDepartments = await this.ctx.model.department.select();
        context.localDepartmentsMap = {};
        for (const localDepartment of context.localDepartments) {
          localDepartment.__status = 0;
          context.localDepartmentsMap[localDepartment.departmentId] = localDepartment;
        }
        // loop create/update
        for (const remoteDepartment of context.remoteDepartments) {
          await this._queueSyncDepartment({ context, remoteDepartment });
        }
        // delete __status===0
        for (const departmentId in context.localDepartmentsMap) {
          const localDepartment = context.localDepartmentsMap[departmentId];
          if (localDepartment.__status === 0) {
            await this._deleteRoleAndDepartment({ localDepartment, department: null });
            // progress
            await this._progressPublish({ context, done: 0, text: `- ${localDepartment.departmentName}` });
          }
        }
        // build roles
        this._roleBuild();
        // progress done
        await this.ctx.bean.status.set('syncDepartments', true);
        await this._progressPublish({ context, done: 1, text: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this._progressPublish({ context, done: -1, text: err.message });
        // throw err
        throw err;
      }
    }

    // queue sync members
    async _queueSyncMembers({ progressId, userOp }) {
      // prepare context
      const context = {
        remoteMembers: null,
        progressId,
        userOp,
      };
      try {
        // progress
        await this._progressPublish({ context, done: 0, text: `--- ${this.ctx.text('Sync Started')} ---` });
        // check departments syncStatus
        const syncStatus = await this.syncStatus();
        if (!syncStatus.departments) return this.ctx.throw(1006);
        // remote members
        const departmentRoot = await this.ctx.model.department.get({ departmentParentId: 0 });
        if (!departmentRoot) return this.ctx.throw(1006);
        const res = await this.ctx.bean.dingtalk.app.selfBuilt.user.listAll(null, false);
        context.remoteMembers = res.userlist;
        // progress
        await this._progressPublish({
          context,
          done: 0,
          text: `--- ${this.ctx.text('Member Count')}: ${context.remoteMembers.length} ---`,
        });
        // local members
        context.localMembers = await this.ctx.model.member.select();
        context.localMembersMap = {};
        for (const localMember of context.localMembers) {
          localMember.__status = 0;
          context.localMembersMap[localMember.memberId] = localMember;
        }
        // loop create/update
        for (const remoteMember of context.remoteMembers) {
          await this._queueSyncMember({ context, remoteMember });
        }
        // delete __status===0
        for (const memberId in context.localMembersMap) {
          const localMember = context.localMembersMap[memberId];
          if (localMember.__status === 0) {
            await this._deleteUserAndMember({ localMember, member: null });
            // progress
            await this._progressPublish({ context, done: 0, text: `- ${localMember.name}` });
          }
        }
        // progress done
        await this.ctx.bean.status.set('syncMembers', true);
        await this._progressPublish({ context, done: 1, text: `--- ${this.ctx.text('Sync Completed')} ---` });
      } catch (err) {
        // progress error
        await this._progressPublish({ context, done: -1, text: err.message });
        // throw err
        throw err;
      }
    }

    async _progressPublish({ context, done, text }) {
      const ioMessage = {
        userIdTo: context.userOp.id,
        messageFilter: context.progressId,
        content: { done, text },
      };
      await this.ctx.bean.io.publish({
        path: `/${moduleInfo.url}/progress/${context.progressId}`,
        message: ioMessage,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'progress',
        },
      });
    }

    async _queueSyncDepartment({ context, remoteDepartment }) {
      // retrieve the department details
      remoteDepartment = await this.ctx.bean.dingtalk.app.selfBuilt.department.get(remoteDepartment.id);
      if (remoteDepartment.id === 1) remoteDepartment.parentid = 0;
      // adjust
      const department = {};
      this._adjustFields(department, remoteDepartment, __departmentFieldMap);
      // console.log(remoteDepartment);
      const departmentId = department.departmentId;
      // check if local department exists
      const localDepartment = context.localDepartmentsMap[departmentId];
      // new department
      if (!localDepartment) {
        await this._createRoleAndDepartment({ department });
        // progress
        await this._progressPublish({ context, done: 0, text: `+ ${department.departmentName}` });
        // done
        return;
      }
      // update
      await this._updateRoleAndDepartment({ localDepartment, department });
      // progress: not prompt
      // done
      localDepartment.__status = 1; // handled
      return;
    }

    async _queueSyncMember({ context, remoteMember }) {
      const member = {};
      this._adjustFields(member, remoteMember, __memberFieldMap);
      const memberId = member.memberId;
      // check if local member exists
      const localMember = context.localMembersMap[memberId];
      // new member
      if (!localMember) {
        await this._createUserAndMember({ member });
        // progress
        await this._progressPublish({ context, done: 0, text: `+ ${member.name}` });
        // done
        return;
      }
      // update
      await this._updateUserAndMember({ localMember, member });
      // progress: not prompt
      // done
      localMember.__status = 1; // handled
      return;
    }

    async _deleteRoleAndDepartment({ localDepartment, department }) {
      // localDepartment
      if (!localDepartment) {
        localDepartment = await this.ctx.model.department.get({ departmentId: department.departmentId });
        if (!localDepartment) {
          this.ctx.throw(1004, department.departmentId);
        }
      }
      // delete role
      await this.ctx.bean.role.delete({ roleId: localDepartment.roleId, force: true });
      // delete department
      await this.ctx.model.department.delete({ id: localDepartment.id });
    }

    async _deleteUserAndMember({ localMember, member }) {
      // localMember
      if (!localMember) {
        localMember = await this.ctx.model.member.get({ memberId: member.memberId });
        if (!localMember) {
          this.ctx.throw(1005, member.memberId);
        }
      }
      const userId = localMember.userId;
      // delete user: including roles/auth
      await this.ctx.bean.user.delete({ userId });
      // delete member
      await this.ctx.model.member.delete({ id: localMember.id });
    }

    async _updateRoleAndDepartment({ localDepartment, department }) {
      // console.log(department);
      // localDepartment
      if (!localDepartment) {
        localDepartment = await this.ctx.model.department.get({ departmentId: department.departmentId });
        if (!localDepartment) {
          this.ctx.throw(1004, department.departmentId);
        }
      }
      // update role
      await this._updateRoleAndDepartment_role({ localDepartment, department });
      // update department
      department.id = localDepartment.id;
      await this.ctx.model.department.update(department);
    }

    async _updateRoleAndDepartment_role({ localDepartment, department }) {
      // change role parent
      if (department.departmentParentId && department.departmentParentId !== localDepartment.departmentParentId) {
        const departmentParent = await this.ctx.model.department.get({ departmentId: department.departmentParentId });
        if (!departmentParent) {
          this.ctx.throw(1004, department.departmentParentId);
        }
        const roleIdParent = departmentParent.roleId;
        // move
        await this.ctx.bean.role.move({ roleId: localDepartment.roleId, roleIdParent });
      }
      // update role: name/order
      const data = {};
      if (department.departmentName) {
        data.roleName = department.departmentName;
      }
      if (department.departmentOrder) {
        data.sorting = department.departmentOrder;
      }
      if (Object.keys(data).length > 0) {
        await this.ctx.bean.role.save({
          roleId: localDepartment.roleId,
          data,
        });
      }
    }

    async _updateUserRoles({ userId, departmentIdsOld, departmentIdsNew }) {
      const departmentIdsAdd = [];
      const departmentIdsDelete = [];
      for (const departmentId of departmentIdsNew) {
        if (departmentIdsOld.indexOf(departmentId) === -1) {
          departmentIdsAdd.push(departmentId);
        }
      }
      for (const departmentId of departmentIdsOld) {
        if (departmentIdsNew.indexOf(departmentId) === -1) {
          departmentIdsDelete.push(departmentId);
        }
      }
      // add
      await this._addUserRoles({ userId, departmentIds: departmentIdsAdd });
      // delete
      await this._deleteUserRoles({ userId, departmentIds: departmentIdsDelete });
    }

    async _updateUserAndMember({ localMember, member }) {
      // localMember
      if (!localMember) {
        localMember = await this.ctx.model.member.get({ memberId: member.memberId });
        if (!localMember) {
          this.ctx.throw(1005, member.memberId);
        }
      }
      const userId = localMember.userId;
      // roles
      if (member.department !== undefined && member.department !== localMember.department) {
        await this._updateUserRoles({
          userId,
          departmentIdsOld: (localMember.department || '').split(','),
          departmentIdsNew: (member.department || '').split(','),
        });
      }
      // active
      if (member.active !== undefined && member.active !== localMember.active) {
        await this.ctx.bean.user.disable({ userId, disabled: !member.active });
      }
      // update member
      member.id = localMember.id;
      await this.ctx.model.member.update(member);
    }

    async _createRoleAndDepartment({ department }) {
      // get parent role
      const roleParent = await this._getRoleOfDepartment({ departmentId: department.departmentParentId });
      if (!roleParent) {
        this.ctx.throw(1003, department.departmentParentId);
      }
      // create current role
      const roleIdCurrent = await this.ctx.bean.role.add({
        roleName: department.departmentName,
        catalog: 0, // update by sub role
        sorting: department.departmentOrder,
        roleIdParent: roleParent.id,
      });
      // force change parent role to catalog=1
      await this.ctx.bean.role.save({
        roleId: roleParent.id,
        data: { catalog: 1 },
      });
      // creat department
      department.roleId = roleIdCurrent;
      const res = await this.ctx.model.department.insert(department);
      return res.insertId;
    }

    // [1,2]
    async _addUserRoles({ userId, departmentIds }) {
      for (const departmentId of departmentIds) {
        // get role of department
        const roleCurrent = await this._getRoleOfDepartment({ departmentId });
        if (!roleCurrent) {
          this.ctx.throw(1003, departmentId);
        }
        // add user role
        await this.ctx.bean.role.addUserRole({ userId, roleId: roleCurrent.id });
      }
    }

    async _deleteUserRoles({ userId, departmentIds }) {
      for (const departmentId of departmentIds) {
        // get role of department
        const roleCurrent = await this._getRoleOfDepartment({ departmentId });
        if (!roleCurrent) {
          this.ctx.throw(1003, departmentId);
        }
        // add user role
        await this.ctx.bean.role.deleteUserRole({ userId, roleId: roleCurrent.id });
      }
    }

    async _createUserAndMember({ member }) {
      // 1. create user&auth
      // verify auth user
      const dingtalkHelper = new (DingtalkHelperFn(this.ctx))();
      const verifyUser = await dingtalkHelper.verifyAuthUser({ scene: 'dingtalk', member, needLogin: false });
      const userId = verifyUser.agent.id;

      // 2. add user to role
      if (member.department) {
        await this._addUserRoles({ userId, departmentIds: member.department.split(',') });
        // delete role:activated (need not)
      }

      // 3. active
      if (!member.active) {
        await this.ctx.bean.user.disable({ userId, disabled: true });
      }

      // 4. create member
      member.userId = userId;
      const res = await this.ctx.model.member.insert(member);
      const memberId = res.insertId;

      // 5. send message: account migration
      const sendLinkAccountMigration = await this.ctx.bean.settings.getInstance({
        name: '/groupInfo/sendLinkAccountMigration',
      });
      if (sendLinkAccountMigration) {
        await this._sendLinkAccountMigration({ userId });
      }

      // ok
      return memberId;
    }

    async _sendLinkAccountMigration({ userId }) {
      this.ctx.tail(async () => {
        const msg = {
          msgtype: 'link',
          link: {
            messageUrl: this.ctx.bean.base.getAbsoluteUrl('/#!/a/login/migrate'),
            picUrl: this.ctx.bean.base.getStaticUrl('/a/base/img/cabloy.png'),
            title: this.ctx.text('AccountMigration'),
            text: this.ctx.text('AccountMigrationDesp'),
          },
        };
        const content = {
          userIds: [userId],
          data: { msg },
        };
        await this.ctx.bean.io.pushDirect({
          content,
          channel: { module: 'a-dingtalk', name: 'app' },
        });
      });
    }

    // not create new role here
    async _getRoleOfDepartment({ departmentId }) {
      // role top
      if (departmentId === 0) {
        return await this._getRoleTop();
      }
      // department
      const department = await this.ctx.model.department.get({ departmentId });
      if (!department) return null;
      return await this.ctx.bean.role.get({ id: department.roleId });
    }

    // get role top
    async _getRoleTop() {
      const roleContainer = await this.ctx.bean.role.parseRoleName({
        roleName: this.ctx.config.sync.department.roleContainer,
      });
      const roleTop = await this.ctx.bean.role.get({
        roleName: this.ctx.config.sync.department.roleTop,
        roleIdParent: roleContainer.id,
      });
      if (roleTop) return roleTop;
      // create role
      const data = {
        roleName: this.ctx.config.sync.department.roleTop,
        catalog: 1,
        sorting: 0,
        roleIdParent: roleContainer.id,
      };
      data.id = await this.ctx.bean.role.add(data);
      return data;
    }

    _adjustFields(itemDest, itemSrc, fieldMap) {
      for (const index in fieldMap[1]) {
        const field = fieldMap[1][index];
        if (itemSrc[field] !== undefined) {
          const fieldDest = fieldMap[0][index];
          itemDest[fieldDest] = this._adjustFieldType(itemSrc[field], fieldMap[2][index]);
        }
      }
    }
    _adjustFieldType(value, type) {
      if (type === 'number') return Number(value);
      else if (type === 'bool') return Boolean(value);
      else if (type === 'string') return String(value);
      else if (type === 'array') return value.join(',');
      else if (type === 'json') return JSON.stringify(value);
      else if (type === 'timestamp') return new Date(value);
      return value;
    }

    _roleBuild() {
      this.ctx.tail(async () => {
        await this.ctx.bean.role.build();
      });
    }
  }

  return Contacts;
};


/***/ }),

/***/ 173:
/***/ ((module) => {

module.exports = app => {
  class JSSDK extends app.Service {
    async jsconfig({ url }) {
      // config
      const config = this.ctx.config.account.dingtalk;
      const configAppSelfBuilt = config.apps.selfBuilt;
      // jsconfig
      const res = await this.ctx.bean.dingtalk.app.selfBuilt.client.getJSApiConfig(url);
      return {
        ...res,
        agentId: configAppSelfBuilt.agentid,
        type: configAppSelfBuilt.jssdk.type,
        jsApiList: configAppSelfBuilt.jssdk.jsApiList,
      };
    }
  }

  return JSSDK;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const callback = __webpack_require__(318);
const contacts = __webpack_require__(67);
const jssdk = __webpack_require__(173);
const auth = __webpack_require__(300);

module.exports = app => {
  const services = {
    callback,
    contacts,
    jssdk,
    auth,
  };
  return services;
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map