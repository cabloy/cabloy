const require3 = require('require3');
const bb = require3('bluebird');
const extend = require3('extend2');
const WxworkAPI = require3('@zhennann/co-wxwork-api');
const WechatAPI = require3('@zhennann/co-wechat-api');
const authProviderScenes = require('./authProviderScenes.js');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WxworkHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    createWxworkApi() {
      const self = this;
      return new Proxy({}, {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'app') {
            // app
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  if (prop === 'mini') {
                    // app.mini
                    obj[prop] = new Proxy({}, {
                      get(obj, prop) {
                        if (!obj[prop]) {
                          obj[prop] = self._createWxworkApiApp({ appName: prop, mini: true });
                        }
                        return obj[prop];
                      },
                    });
                  } else {
                    // others
                    obj[prop] = self._createWxworkApiApp({ appName: prop });
                  }
                }
                return obj[prop];
              },
            });
          } else if (prop === 'mini') {
            // mini
            obj[prop] = new Proxy({}, {
              get(obj, prop) {
                if (!obj[prop]) {
                  obj[prop] = self._createWxworkApiMini({ sceneShort: prop });
                }
                return obj[prop];
              },
            });
          } else if (prop === 'util') {
            // util
            obj[prop] = self._createWxworkApiUtil();
          }
          return obj[prop];
        },
      });
    }

    // scene: wxwork/wxworkweb/wxworkmini
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

    _createWxworkApiApp({ appName, mini }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
      const configApp = mini ? config.minis[appName] : config.apps[appName];
      // api
      const api = new WxworkAPI.CorpAPI(config.corpid, configApp.secret,
        async function() {
          const cacheKey = `wxwork-token:${appName || ''}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = `wxwork-token:${appName || ''}`;
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
        }
      );
      // registerTicketHandle
      api.registerTicketHandle(
        async function(type) {
          const cacheKey = `wxwork-jsticket:${appName}:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wxwork-jsticket:${appName}:${type}`;
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

    _createWxworkApiMini({ sceneShort }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
      const configMini = config.minis[sceneShort];
      // api
      const api = new WechatAPI(configMini.appID, configMini.appSecret,
        async function() {
          const cacheKey = `wxworkmini-token:${sceneShort}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = `wxworkmini-token:${sceneShort}`;
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
        }
      );
      // registerTicketHandle
      api.registerTicketHandle(
        async function(type) {
          const cacheKey = `wxworkmini-jsticket:${sceneShort}:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wxworkmini-jsticket:${sceneShort}:${type}`;
          if (token) {
            await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
          } else {
            await ctx.cache.db.module(moduleInfo.relativeName).remove(cacheKey);
          }
        }
      );
      // registerSessionKeyHandle
      api.registerSessionKeyHandle(
        async function() {
          const cacheKey = `wxworkmini-sessionKey:${sceneShort}:${ctx.user.agent.id}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(sessionKey) {
          const cacheKey = `wxworkmini-sessionKey:${sceneShort}:${ctx.user.agent.id}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
        }
      );
      // ready
      return api;
    }

    _createWxworkApiUtil() {
      return {
        // scene: empty/wxwork/wxworkweb/wxworkmini/wxworkminidefault/xxx,xxx,xxx
        in(scene) {
          // scene
          if (!scene) scene = 'wxwork';
          if (typeof scene === 'string') scene = scene.split(',');
          // provider
          const provider = ctx.user && ctx.user.provider;
          if (!provider || provider.module !== moduleInfo.relativeName) return false;
          // find any match
          for (const item of scene) {
            const ok = (provider.providerName === item) || (item === 'wxworkmini' && provider.providerName.indexOf(item) > -1);
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
