const require3 = require('require3');
const bb = require3('bluebird');
const extend = require3('extend2');
const DingtalkAPI = require3('@zhennann/node-dingtalk');
const authProviderScenes = require('./authProviderScenes.js');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WxworkHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    // ctx.meta.dingtalk.app.selfBuilt
    // ctx.meta.dingtalk.admin
    // ctx.meta.dingtalk.web.default
    // ctx.meta.dingtalk.mini.default
    createDingtalkApi() {
      const self = this;
      return new Proxy({}, {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'app') {
            // app
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  obj[prop] = self._createDingtalkApiApp({ appName: prop });
                }
                return obj[prop];
              },
            });
          } else if (prop === 'admin') {
            obj[prop] = self._createDingtalkApiAdmin();
          } else if (prop === 'web') {
            // web
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  obj[prop] = self._createDingtalkApiWeb({ webName: prop });
                }
                return obj[prop];
              },
            });
          } else if (prop === 'mini') {
            // mini
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  obj[prop] = self._createDingtalkApiMini({ sceneShort: prop });
                }
                return obj[prop];
              },
            });
          } else if (prop === 'util') {
            // util
            obj[prop] = self._createDingtalkApiUtil();
          }
          return obj[prop];
        },
      });
    }

    // scene: dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini
    async verifyAuthUser({ scene, memberId, member, cbVerify, state = 'login', needLogin = true }) {
      if (state === 'associate') {
        // not allowed associate
        return ctx.throw(403);
      }
      // userInfo(member)
      if (!member) {
        member = await this._getMemberByMemberId({ memberId });
        if (!member) return ctx.throw(403);
      }
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, memberId: member.memberId, member });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state: 'login', profileUser });
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

    // profileId: wxwork:memberId
    async _ensureAuthUser({ scene, memberId, member }) {
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const profileId = `wxwork:${memberId}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
          userName: member.alias || member.name,
          realName: member.name,
          avatar: member.avatar,
          email: member.email,
          mobile: member.mobile,
          emailConfirmed: true,
          mobileVerified: true,
          profile: member,
        },
      };
      // provider
      const providerItem = await ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: sceneInfo.authProvider,
      });
      // check auth
      let authId;
      let authUserId;
      const authItems = await ctx.model.query(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId=?',
        [ ctx.instance.id, providerItem.id, profileId ]
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
        [ ctx.instance.id, profileId, authId ]
      );
      const _authOther = _authOthers[0];
      if (_authOther && _authOther.userId !== authUserId) {
        // update userId for this auth
        await modelAuth.update({ id: authId, userId: _authOther.userId });
      }
      // ready
      return profileUser;
    }

    _createDingtalkApiGeneral({ category, appName, appkey, appsecret, sso }) {
      // api
      const api = new DingtalkAPI(
        {
          appkey, appsecret, sso,
        },
        async function() {
          const cacheKey = `dingtalk-token:${category}:${appName || ''}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
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
        async function(type) {
          const cacheKey = `dingtalk-jsticket:${category}:${appName}:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
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

    _createDingtalkApiApp({ appName }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
      const configApp = config.apps[appName];
      return this._createDingtalkApiGeneral({
        category: 'app',
        appName,
        appkey: configApp.appkey,
        appsecret: configApp.appsecret,
      });
    }

    _createDingtalkApiAdmin() {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
      return this._createDingtalkApiGeneral({
        category: 'admin',
        appName: '',
        appkey: config.corpid,
        appsecret: config.ssosecret,
        sso: true,
      });
    }

    _createDingtalkApiWeb({ webName }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
      const configWeb = config.webs[webName];
      return this._createDingtalkApiGeneral({
        category: 'web',
        appName: webName,
        appkey: configWeb.appid,
        appsecret: configWeb.appsecret,
      });
    }

    _createDingtalkApiMini({ sceneShort }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.dingtalk;
      const configMini = config.minis[sceneShort];
      return this._createDingtalkApiGeneral({
        category: 'mini',
        appName: sceneShort,
        appkey: configMini.appkey,
        appsecret: configMini.appsecret,
      });
    }

    _createDingtalkApiUtil() {
      return {
        // scene: empty/dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini/dingtalkminidefault/xxx,xxx,xxx
        in(scene) {
          // scene
          if (!scene) scene = 'dingtalk';
          if (typeof scene === 'string') scene = scene.split(',');
          // provider
          const provider = ctx.user && ctx.user.provider;
          if (!provider || provider.module !== moduleInfo.relativeName) return false;
          // find any match
          for (const item of scene) {
            const ok = (provider.providerName === item) || (item === 'dingtalkmini' && provider.providerName.indexOf(item) > -1);
            if (ok) return true;
          }
          // not found
          return false;
        },
      };
    }

  }

  return WxworkHelper;
};
